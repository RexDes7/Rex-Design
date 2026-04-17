# Manual Testing Checklist - Task 17.3

## Overview

This checklist covers manual testing requirements for the admin panel as specified in task 17.3.

## Testing Environment

- **Browser**: Chrome, Firefox, Safari
- **Screen Resolutions**: 1024px, 1366px, 1920px, 2560px
- **Test Database**: Use a copy of production data or comprehensive test data

## 1. Responsive Design Testing

### Minimum Width (1024px)

- [ ] **Dashboard Page**
  - [ ] All widgets are visible and properly aligned
  - [ ] Statistics cards display correctly
  - [ ] Recent activity lists are readable
  - [ ] Navigation sidebar is accessible
  - [ ] No horizontal scrolling required

- [ ] **Projects List Page**
  - [ ] Project grid/list displays properly
  - [ ] Images are properly sized
  - [ ] Edit/Delete buttons are accessible
  - [ ] Drag-and-drop reordering works (if implemented)

- [ ] **Project Form (Create/Edit)**
  - [ ] All form fields are visible
  - [ ] Image uploader displays correctly
  - [ ] Form validation messages are readable
  - [ ] Submit/Cancel buttons are accessible

- [ ] **Content Editor**
  - [ ] Text editors are usable
  - [ ] Preview pane displays correctly (if implemented)
  - [ ] All sections are accessible

- [ ] **Analytics Page**
  - [ ] Charts render properly
  - [ ] Statistics are readable
  - [ ] Date filters are accessible
  - [ ] Tables display correctly

- [ ] **Settings Page**
  - [ ] Backup controls are visible
  - [ ] Settings forms are usable
  - [ ] Action buttons are accessible


### Larger Resolutions (1366px, 1920px, 2560px)

- [ ] **Layout Scaling**
  - [ ] Content scales appropriately
  - [ ] No excessive whitespace
  - [ ] Images maintain aspect ratios
  - [ ] Text remains readable

- [ ] **Navigation**
  - [ ] Sidebar remains accessible
  - [ ] Header elements are properly spaced
  - [ ] Active page highlighting works

## 2. Image Quality Testing

### Upload and Optimization

- [ ] **JPEG Images**
  - [ ] Upload a high-quality JPEG (>2MB)
  - [ ] Verify file size is reduced after optimization
  - [ ] Check visual quality is acceptable (no visible artifacts)
  - [ ] Confirm image displays correctly on public site

- [ ] **PNG Images**
  - [ ] Upload a PNG with transparency
  - [ ] Verify optimization maintains transparency
  - [ ] Check file size reduction
  - [ ] Confirm quality is acceptable

- [ ] **WebP Images**
  - [ ] Upload a WebP image
  - [ ] Verify optimization works
  - [ ] Check browser compatibility
  - [ ] Confirm display quality

- [ ] **Avatar Images**
  - [ ] Upload an avatar image
  - [ ] Verify it's resized to exactly 200x200px
  - [ ] Check aspect ratio is maintained (cropped if necessary)
  - [ ] Confirm quality is acceptable at small size

### Image Validation

- [ ] **Format Validation**
  - [ ] Try uploading a .gif file (should be rejected)
  - [ ] Try uploading a .bmp file (should be rejected)
  - [ ] Try uploading a .svg file (should be rejected)
  - [ ] Verify error message is clear and helpful

- [ ] **Size Validation**
  - [ ] Try uploading a file >5MB (should be rejected)
  - [ ] Verify error message shows file size and limit
  - [ ] Confirm upload works with file just under 5MB


## 3. UX Flow Testing

### Authentication Flow

- [ ] **Login**
  - [ ] Enter valid credentials → should redirect to dashboard
  - [ ] Enter invalid email → should show error message
  - [ ] Enter invalid password → should show error message
  - [ ] Leave fields empty → should show validation errors
  - [ ] Error messages are clear and helpful

- [ ] **Session Management**
  - [ ] After login, verify session persists on page refresh
  - [ ] Try accessing protected route without login → should redirect to login
  - [ ] After logout, verify cannot access protected routes

- [ ] **Rate Limiting**
  - [ ] Make 5 failed login attempts
  - [ ] Verify 6th attempt is blocked
  - [ ] Verify error message explains the block
  - [ ] Wait 15 minutes and verify can login again

### Project Management Flow

- [ ] **Create Project**
  - [ ] Fill all required fields → should save successfully
  - [ ] Leave required field empty → should show validation error
  - [ ] Upload image → should display preview
  - [ ] Submit form → should redirect to projects list
  - [ ] Verify new project appears in list
  - [ ] Verify project appears on public site

- [ ] **Edit Project**
  - [ ] Click edit on existing project
  - [ ] Verify form is pre-filled with current data
  - [ ] Change title → save → verify change persists
  - [ ] Replace image → verify old image is deleted
  - [ ] Cancel edit → verify no changes are saved

- [ ] **Delete Project**
  - [ ] Click delete button
  - [ ] Verify confirmation dialog appears
  - [ ] Cancel deletion → verify project remains
  - [ ] Confirm deletion → verify project is removed
  - [ ] Verify associated images are deleted from filesystem
  - [ ] Verify project no longer appears on public site


### Content Management Flow

- [ ] **Edit Site Content**
  - [ ] Navigate to content editor
  - [ ] Modify "About" section → save → verify change
  - [ ] Modify manifesto principles → save → verify change
  - [ ] Modify skills list → save → verify change
  - [ ] Verify changes appear on public site
  - [ ] Verify preview works (if implemented)

- [ ] **Edit Contact Info**
  - [ ] Change email address → verify validation
  - [ ] Enter invalid email → should show error
  - [ ] Change phone number → save → verify change
  - [ ] Update social links → save → verify change
  - [ ] Verify changes appear on public site

### Analytics Flow

- [ ] **View Analytics**
  - [ ] Navigate to analytics page
  - [ ] Verify page views statistics display
  - [ ] Verify click statistics display
  - [ ] Verify form submissions display
  - [ ] Check that charts render correctly

- [ ] **Filter Analytics**
  - [ ] Apply date range filter → verify data updates
  - [ ] Change grouping (day/week/month) → verify data updates
  - [ ] Verify filtered data is accurate

- [ ] **Form Submissions**
  - [ ] View list of form submissions
  - [ ] Mark submission as read → verify status changes
  - [ ] Mark as unread → verify status changes
  - [ ] Verify all submission details are visible

### Backup and Restore Flow

- [ ] **Create Backup**
  - [ ] Navigate to settings page
  - [ ] Click "Create Backup" button
  - [ ] Verify backup is created successfully
  - [ ] Verify backup appears in backup list
  - [ ] Check backup directory contains database and images

- [ ] **Restore Backup**
  - [ ] Select a backup from the list
  - [ ] Click "Restore" button
  - [ ] Verify confirmation dialog appears
  - [ ] Confirm restoration
  - [ ] Verify data is restored correctly
  - [ ] Verify images are restored


## 4. Error Message Testing

### Validation Errors

- [ ] **Form Validation**
  - [ ] Submit empty form → error messages are clear
  - [ ] Invalid email format → error explains format requirement
  - [ ] Invalid year format → error explains expected format
  - [ ] File too large → error shows size limit
  - [ ] Invalid file type → error lists allowed types

### System Errors

- [ ] **Network Errors**
  - [ ] Simulate network failure during save
  - [ ] Verify error message is user-friendly
  - [ ] Verify data is not corrupted

- [ ] **Authentication Errors**
  - [ ] Expired session → clear message and redirect to login
  - [ ] Invalid token → appropriate error message
  - [ ] Rate limit exceeded → explains wait time

### Error Recovery

- [ ] **Graceful Degradation**
  - [ ] If analytics tracking fails, verify it doesn't block user actions
  - [ ] If image optimization fails, verify fallback behavior
  - [ ] If backup fails, verify admin is notified but system continues

## 5. Performance Testing

### Large Data Volumes

- [ ] **Projects List**
  - [ ] Create 50+ projects
  - [ ] Verify list loads in reasonable time (<2 seconds)
  - [ ] Verify pagination works (if implemented)
  - [ ] Verify search/filter works quickly

- [ ] **Analytics Data**
  - [ ] Generate 1000+ page view events
  - [ ] Verify analytics page loads in reasonable time
  - [ ] Verify charts render without lag
  - [ ] Verify date filtering is responsive

- [ ] **Logs**
  - [ ] Generate 500+ log entries
  - [ ] Verify logs page loads quickly
  - [ ] Verify filtering is responsive
  - [ ] Verify search works efficiently

### Image Upload Performance

- [ ] **Upload Speed**
  - [ ] Upload 5MB image → should complete in <10 seconds
  - [ ] Upload multiple images → verify queue handling
  - [ ] Verify progress indicators work


## 6. Cross-Browser Testing

### Chrome

- [ ] All features work correctly
- [ ] Images display properly
- [ ] Forms submit successfully
- [ ] No console errors

### Firefox

- [ ] All features work correctly
- [ ] Images display properly
- [ ] Forms submit successfully
- [ ] No console errors

### Safari

- [ ] All features work correctly
- [ ] Images display properly
- [ ] Forms submit successfully
- [ ] No console errors

## 7. Security Testing

### Authentication Security

- [ ] **Session Security**
  - [ ] Verify cookies have HttpOnly flag
  - [ ] Verify cookies have Secure flag (in production)
  - [ ] Verify cookies have SameSite=Strict
  - [ ] Verify session expires after 24 hours

- [ ] **Password Security**
  - [ ] Verify passwords are never visible in network requests
  - [ ] Verify passwords are hashed in database
  - [ ] Verify failed login attempts are logged

### Input Security

- [ ] **XSS Prevention**
  - [ ] Try entering `<script>alert('xss')</script>` in text fields
  - [ ] Verify script is not executed
  - [ ] Verify input is sanitized

- [ ] **SQL Injection Prevention**
  - [ ] Try entering `'; DROP TABLE projects; --` in search
  - [ ] Verify query is safely handled
  - [ ] Verify no database errors

## Testing Results

### Summary

- **Total Checks**: [Count]
- **Passed**: [Count]
- **Failed**: [Count]
- **Blocked**: [Count]

### Issues Found

| Issue | Severity | Description | Status |
|-------|----------|-------------|--------|
|       |          |             |        |

### Recommendations

[Add any recommendations based on testing results]

## Sign-off

- **Tester**: ___________________
- **Date**: ___________________
- **Status**: [ ] Approved [ ] Needs Work
- **Notes**: ___________________

