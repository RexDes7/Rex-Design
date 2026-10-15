/**
 * Форма проекта (создание/редактирование): мультизагрузка изображений,
 * галерея с выбором обложки, русские тексты ошибок.
 */
'use client'

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Upload, Trash2, Star, ArrowLeft, Save } from 'lucide-react'
import {
  adminFetch,
  parseJsonArray,
  PROJECT_CATEGORIES,
  type AdminProject,
} from './api'

interface ProjectFormProps {
  project: AdminProject | null
  onSaved: (message: string) => void
  onCancel: () => void
}

interface FormErrors {
  title?: string
  description?: string
  category?: string
  year?: string
}

const MAX_SIZE = 4 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function ProjectForm({ project, onSaved, onCancel }: ProjectFormProps) {
  const isEdit = project !== null

  const [title, setTitle] = useState(project?.title ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [category, setCategory] = useState(project?.category ?? 'Веб-Дизайн')
  const [year, setYear] = useState(project?.year ?? String(new Date().getFullYear()))
  const [imageAlt, setImageAlt] = useState(project?.image_alt ?? project?.imageAlt ?? '')
  const [featured, setFeatured] = useState(project?.featured === 1)
  const [wide, setWide] = useState(project?.wide === 1)

  // Галерея: существующие изображения проекта + обложка (если её нет в списке)
  const [gallery, setGallery] = useState<string[]>(() => {
    const imgs = parseJsonArray(project?.images)
    const coverUrl = project?.image ?? ''
    if (coverUrl && !imgs.includes(coverUrl)) return [coverUrl, ...imgs]
    return imgs
  })
  const [cover, setCover] = useState(project?.image ?? '')

  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')

  const [uploading, setUploading] = useState<{ current: number; total: number } | null>(null)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const clearError = (key: keyof FormErrors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  // ==========================================================================
  // Загрузка изображений
  // ==========================================================================

  const handleFilesSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = '' // позволяем выбрать тот же файл повторно
    if (files.length === 0) return

    setUploadError('')

    // Валидация: формат + размер ≤ 4 МБ
    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError(`«${file.name}»: Недопустимый формат. Разрешены JPG, PNG и WebP`)
        return
      }
      if (file.size > MAX_SIZE) {
        setUploadError(`«${file.name}»: Файл больше 4 МБ`)
        return
      }
    }

    // Последовательная загрузка с прогрессом «Загрузка N из M…»
    const uploaded: string[] = []
    for (let i = 0; i < files.length; i++) {
      setUploading({ current: i + 1, total: files.length })
      try {
        const formData = new FormData()
        formData.append('file', files[i])
        const res = await adminFetch<{ success: boolean; data: { url: string } }>(
          '/api/admin/upload',
          { method: 'POST', body: formData }
        )
        uploaded.push(res.data.url)
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Ошибка загрузки файла')
        break
      }
    }
    setUploading(null)

    if (uploaded.length > 0) {
      setGallery((prev) => {
        const next = [...prev, ...uploaded.filter((u) => !prev.includes(u))]
        return next
      })
      setCover((prev) => prev || uploaded[0])
    }
  }

  const removeImage = (url: string) => {
    setGallery((prev) => {
      const next = prev.filter((u) => u !== url)
      setCover((prevCover) =>
        prevCover === url ? next[0] ?? '' : prevCover
      )
      return next
    })
  }

  // ==========================================================================
  // Сабмит
  // ==========================================================================

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!title.trim()) next.title = 'Введите название проекта'
    if (!description.trim()) next.description = 'Введите описание проекта'
    if (!category) next.category = 'Выберите категорию'
    if (!year.trim()) next.year = 'Укажите год'
    else if (!/^\d{4}$/.test(year.trim())) next.year = 'Год должен состоять из 4 цифр'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    setApiError('')

    const finalCover = cover || gallery[0] || ''

    try {
      const body = JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        category,
        year: year.trim(),
        image_alt: imageAlt.trim(),
        image: finalCover,
        images: JSON.stringify(gallery),
        featured: featured ? 1 : 0,
        wide: wide ? 1 : 0,
      })

      if (isEdit) {
        await adminFetch(`/api/admin/projects/${project.id}`, { method: 'PUT', body })
        onSaved(`Проект «${title.trim()}» обновлён`)
      } else {
        await adminFetch('/api/admin/projects', { method: 'POST', body })
        onSaved(`Проект «${title.trim()}» создан`)
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Не удалось сохранить проект')
      setSaving(false)
    }
  }

  // ==========================================================================
  // Рендер
  // ==========================================================================

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-3xl">
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#8a8f98] transition-colors hover:text-[#E63946]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        К списку проектов
      </button>

      <h2 className="mt-4 flex items-center gap-3 font-display text-3xl font-bold uppercase text-[#E8E4DF]">
        {isEdit ? 'Редактирование' : 'Новый проект'}
        <span className="block h-3 w-3 bg-[#E63946]" aria-hidden="true" />
      </h2>

      {apiError && (
        <div
          role="alert"
          className="mt-4 border-2 border-[#E63946] bg-[#E63946]/10 px-4 py-3 text-sm text-[#E63946]"
        >
          {apiError}
        </div>
      )}

      <div className="mt-6 space-y-5 border-2 border-[#2A2E36] bg-[#111318] p-5 transition-colors hover:border-[#3a3f49] sm:p-6">
        {/* Название */}
        <div>
          <label
            htmlFor="project-title"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
          >
            Название <span className="text-[#E63946]">*</span>
          </label>
          <input
            id="project-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              clearError('title')
            }}
            placeholder="Например: Айдентика для кофейни"
            className="w-full border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] placeholder:text-[#5a5f68] focus:border-[#E63946] focus:outline-none"
          />
          {errors.title && <p className="mt-1.5 font-mono text-xs text-[#E63946]">{errors.title}</p>}
        </div>

        {/* Описание */}
        <div>
          <label
            htmlFor="project-description"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
          >
            Описание <span className="text-[#E63946]">*</span>
          </label>
          <textarea
            id="project-description"
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              clearError('description')
            }}
            placeholder="Короткое описание проекта, задачи и решение"
            className="w-full resize-y border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] placeholder:text-[#5a5f68] focus:border-[#E63946] focus:outline-none"
          />
          {errors.description && (
            <p className="mt-1.5 font-mono text-xs text-[#E63946]">{errors.description}</p>
          )}
        </div>

        {/* Категория + Год */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="project-category"
              className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
            >
              Категория <span className="text-[#E63946]">*</span>
            </label>
            <select
              id="project-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                clearError('category')
              }}
              className="w-full border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] focus:border-[#E63946] focus:outline-none"
            >
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1.5 font-mono text-xs text-[#E63946]">{errors.category}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="project-year"
              className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
            >
              Год <span className="text-[#E63946]">*</span>
            </label>
            <input
              id="project-year"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={year}
              onChange={(e) => {
                setYear(e.target.value)
                clearError('year')
              }}
              placeholder="2026"
              className="w-full border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] placeholder:text-[#5a5f68] focus:border-[#E63946] focus:outline-none"
            />
            {errors.year && <p className="mt-1.5 font-mono text-xs text-[#E63946]">{errors.year}</p>}
          </div>
        </div>

        {/* Alt-текст */}
        <div>
          <label
            htmlFor="project-alt"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
          >
            Alt-текст изображения
          </label>
          <input
            id="project-alt"
            type="text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Описание изображения для доступности"
            className="w-full border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] placeholder:text-[#5a5f68] focus:border-[#E63946] focus:outline-none"
          />
        </div>

        {/* Флажки */}
        <div className="space-y-3 border-t-2 border-[#1c2027] pt-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#E63946]"
            />
            <span className="flex items-center gap-1.5 text-sm text-[#E8E4DF]">
              <Star className="h-4 w-4 text-[#E63946]" aria-hidden="true" />
              Добавить в избранные работы (показывается на главной странице)
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={wide}
              onChange={(e) => setWide(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#E63946]"
            />
            <span className="text-sm text-[#E8E4DF]">
              Широкий формат — карточка на всю ширину сетки
            </span>
          </label>
        </div>

        {/* Загрузка изображений */}
        <div className="border-t-2 border-[#1c2027] pt-5">
          <p className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]">
            Изображения проекта
          </p>

          <label
            htmlFor="project-images"
            className="flex cursor-pointer items-center justify-center gap-3 border-2 border-dashed border-[#2A2E36] bg-[#0A0A0A] px-4 py-6 font-mono text-xs uppercase tracking-widest text-[#8a8f98] transition-colors hover:border-[#E63946] hover:text-[#E63946]"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Добавить изображения
          </label>
          <input
            ref={fileInputRef}
            id="project-images"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFilesSelected}
            disabled={uploading !== null}
            className="sr-only"
          />
          <p className="mt-2 font-mono text-[10px] text-[#5a5f68]">
            JPG, PNG или WebP, до 4 МБ каждое. Первое загруженное станет обложкой.
          </p>

          {uploading && (
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#E63946]">
              Загрузка {uploading.current} из {uploading.total}…
            </p>
          )}
          {uploadError && (
            <p role="alert" className="mt-3 font-mono text-xs text-[#E63946]">
              {uploadError}
            </p>
          )}

          {/* Галерея */}
          {gallery.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {gallery.map((url) => {
                const isCover = cover === url
                return (
                  <figure
                    key={url}
                    className={`border-2 bg-[#0A0A0A] transition-colors ${
                      isCover ? 'border-[#E63946]' : 'border-[#2A2E36] hover:border-[#3a3f49]'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={url}
                        alt={imageAlt || title || 'Изображение проекта'}
                        className="aspect-[4/3] w-full object-cover"
                      />
                      {isCover && (
                        <figcaption className="absolute left-0 top-0 bg-[#E63946] px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
                          Обложка
                        </figcaption>
                      )}
                    </div>
                    <div className="flex divide-x-2 divide-[#1c2027] border-t-2 border-[#1c2027]">
                      <button
                        type="button"
                        onClick={() => setCover(url)}
                        disabled={isCover}
                        className="flex-1 px-2 py-2 font-mono text-[10px] uppercase tracking-widest text-[#E8E4DF] transition-colors hover:text-[#E63946] disabled:cursor-default disabled:text-[#E63946]"
                      >
                        Обложка
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="flex flex-1 items-center justify-center gap-1.5 px-2 py-2 font-mono text-[10px] uppercase tracking-widest text-[#8a8f98] transition-colors hover:text-[#E63946]"
                      >
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                        Удалить
                      </button>
                    </div>
                  </figure>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Действия */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving || uploading !== null}
          className="flex items-center gap-2 border-2 border-[#E63946] bg-[#E63946] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#c42b37] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? 'Сохранение…' : isEdit ? 'Сохранить изменения' : 'Создать проект'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="border-2 border-[#2A2E36] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-[#E8E4DF] transition-colors hover:border-[#E63946] hover:text-[#E63946] disabled:opacity-60"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}
