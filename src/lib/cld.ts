/**
 * Cloudinary-хелперы: производительность лент + полноэкранный просмотр.
 *
 * cldSrc(url, w) — добавляет к URL Cloudinary трансформацию
 *   c_limit,w_{w},q_auto,f_auto:
 *   • c_limit — только уменьшение (оригинал уже меньше — отдаётся как есть);
 *   • q_auto + f_auto — заметно меньший вес и современный формат (webp/avif).
 *   Карточки лент тянули оригиналы до 4164×16118 (3.8 МБ) — из-за декода
 *   таких битмапов ленты и тормозили. Локальные /uploads и прочие URL —
 *   без изменений.
 *
 * probeImageDims(url) — размеры изображения до рендера (нужно, чтобы
 * «высокие» лендинги открывать в режиме прокрутки, а обычные — как раньше):
 *   • Cloudinary: fl_getinfo — крошечный JSON, без скачивания картинки;
 *   • остальные URL: Image()-декод.
 *   Результат кэшируется в Map, повторные открытия мгновенны.
 */

export type ImageDims = { w: number; h: number }

/** h/w ≥ этого значения — «высокое» изображение (лендинг): режим прокрутки */
export const TALL_RATIO = 1.45

/** Ширина (px) для полноэкранного просмотра — c_limit не апскейлит */
export const LIGHTBOX_W = 2400

const CLD_RE = /^https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.+)$/

/** URL с ограничением по ширине (только Cloudinary, остальные — как есть) */
export function cldSrc(url: string, width: number): string {
  if (!url) return url
  const m = CLD_RE.exec(url)
  if (!m) return url
  const [, cloud, tail] = m
  const slash = tail.indexOf('/')
  if (slash === -1) return url
  const seg = tail.slice(0, slash)
  const rest = tail.slice(slash + 1)
  const t = `c_limit,w_${width},q_auto,f_auto`
  // сегмент — версия (v123…): трансформаций нет, вставляем свои
  if (seg === '' || /^v\d+$/.test(seg)) {
    return `https://res.cloudinary.com/${cloud}/image/upload/${t}/${tail}`
  }
  // уже есть трансформации со своей шириной — не вмешиваемся
  if (/[,/]w_\d/.test(seg)) return url
  return `https://res.cloudinary.com/${cloud}/image/upload/${seg},${t}/${rest}`
}

/** Высокое ли изображение (лендинг, свёрстанный в длину) */
export function isTallDims(d: ImageDims): boolean {
  return d.h >= d.w * TALL_RATIO
}

const dimsCache = new Map<string, ImageDims>()
const inflight = new Map<string, Promise<ImageDims | null>>()

/** Размеры из кэша (синхронно) — если уже известны */
export function getCachedDims(url: string): ImageDims | null {
  return dimsCache.get(url) ?? null
}

/**
 * Узнать размеры изображения. Cloudinary отдаёт метаданные через
 * fl_getinfo (байты, не мегабайты); fallback — декод уменьшенной копии.
 */
export function probeImageDims(url: string): Promise<ImageDims | null> {
  const hit = dimsCache.get(url)
  if (hit) return Promise.resolve(hit)
  const running = inflight.get(url)
  if (running) return running

  const task = (async () => {
    let dims: ImageDims | null = null
    const m = CLD_RE.exec(url)
    if (m) {
      try {
        const r = await fetch(
          `https://res.cloudinary.com/${m[1]}/image/upload/fl_getinfo/${m[2]}`
        )
        if (r.ok) {
          const j = (await r.json()) as { input?: { width?: number; height?: number } }
          const w = Number(j?.input?.width)
          const h = Number(j?.input?.height)
          if (w > 0 && h > 0) dims = { w, h }
        }
      } catch {
        // сеть/CORS — ниже fallback
      }
    }
    if (!dims) {
      dims = await new Promise<ImageDims | null>((resolve) => {
        const im = new window.Image()
        im.onload = () =>
          resolve(im.naturalWidth > 0 ? { w: im.naturalWidth, h: im.naturalHeight } : null)
        im.onerror = () => resolve(null)
        // та же ширина, что и показ — декод не пропадёт зря (кэш браузера)
        im.src = m ? cldSrc(url, LIGHTBOX_W) : url
      })
    }
    if (dims) dimsCache.set(url, dims)
    return dims
  })()

  inflight.set(url, task)
  void task.finally(() => inflight.delete(url))
  return task
}
