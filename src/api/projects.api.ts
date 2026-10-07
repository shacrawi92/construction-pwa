import api from './client'

export const projectsApi = {
  list:   (params?: object) => api.get('/projects', { params }).then(r => r.data),
  get:    (id: number)      => api.get(`/projects/${id}`).then(r => r.data),
  create: (data: object)    => api.post('/projects', data).then(r => r.data),
  update: (id: number, data: object) => api.put(`/projects/${id}`, data).then(r => r.data),
  delete: (id: number)      => api.delete(`/projects/${id}`).then(r => r.data),

  // Estimations
  getEstimations:  (id: number)       => api.get(`/projects/${id}/estimations`).then(r => r.data),
  createEstimation:(id: number, data: object) => api.post(`/projects/${id}/estimations`, data).then(r => r.data),

  // Timelines
  getTimelines:  (id: number)            => api.get(`/projects/${id}/timelines`).then(r => r.data),
  createTimeline:(id: number, data: object) => api.post(`/projects/${id}/timelines`, data).then(r => r.data),
  updateTimeline:(id: number, timelineId: number, data: object) =>
    api.patch(`/projects/${id}/timelines/${timelineId}`, data).then(r => r.data),

  // Budgets
  getBudgets: (id: number) => api.get(`/projects/${id}/budgets`).then(r => r.data),
  addTransaction:(id: number, budgetId: number, data: object) =>
    api.post(`/projects/${id}/budgets/${budgetId}/transactions`, data).then(r => r.data),
  getCostReport:(id: number) => api.get(`/projects/${id}/cost-report`).then(r => r.data),
}

export const estimationsApi = {
  get:    (id: number)      => api.get(`/estimations/${id}`).then(r => r.data),
  approve:(id: number)      => api.post(`/estimations/${id}/approve`).then(r => r.data),
  upsertItem:(id: number, data: object) => api.post(`/estimations/${id}/items`, data).then(r => r.data),
  deleteItem:(id: number, itemId: number) => api.delete(`/estimations/${id}/items/${itemId}`).then(r => r.data),
  saveAsTemplate:(id: number, name: string) => api.post(`/estimations/${id}/save-as-template`, { name }).then(r => r.data),
  exportPdf:  (id: number)  => api.get(`/estimations/${id}/export/pdf`,   { responseType: 'blob' }).then(r => r.data),
  exportExcel:(id: number)  => api.get(`/estimations/${id}/export/excel`, { responseType: 'blob' }).then(r => r.data),
}

export const templatesApi = {
  list:   () => api.get('/estimation-templates').then(r => r.data),
  get:    (id: number) => api.get(`/estimation-templates/${id}`).then(r => r.data),
  delete: (id: number) => api.delete(`/estimation-templates/${id}`).then(r => r.data),
}

export const workTypesApi = {
  list: () => api.get('/work-types').then(r => r.data),
}

export const materialsApi = {
  list:   (params?: object) => api.get('/materials', { params }).then(r => r.data),
  get:    (id: number)      => api.get(`/materials/${id}`).then(r => r.data),
  // Requests
  getRequests:   (projectId: number) => api.get(`/projects/${projectId}/material-requests`).then(r => r.data),
  createRequest: (projectId: number, data: object) =>
    api.post(`/projects/${projectId}/material-requests`, data).then(r => r.data),
  approve:(id: number, approvals: object[]) =>
    api.post(`/material-requests/${id}/approve`, { approvals }).then(r => r.data),
  reject: (id: number, note: string) =>
    api.post(`/material-requests/${id}/reject`, { note }).then(r => r.data),
}

export const laborLogsApi = {
  list:   (projectId: number, params?: object) =>
    api.get(`/projects/${projectId}/labor-logs`, { params }).then(r => r.data),
  create: (projectId: number, data: object) =>
    api.post(`/projects/${projectId}/labor-logs`, data).then(r => r.data),
  delete: (projectId: number, logId: number) =>
    api.delete(`/projects/${projectId}/labor-logs/${logId}`).then(r => r.data),
  dailyCost: (projectId: number, from: string, to: string) =>
    api.get(`/projects/${projectId}/labor-logs/daily-cost`, { params: { from, to } }).then(r => r.data),
}
