import { apiClient } from './client';

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  citizenId: string;
  assignedDepartmentId?: string;
  assignedStaffId?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  evidenceUrls: string[];
  resolutionDescription?: string;
  resolutionEvidenceUrls?: string[];
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  citizen?: {
    id: string;
    fullName: string;
    phone?: string;
  };
  assignedDepartment?: {
    id: string;
    name: string;
  };
  assignedStaff?: {
    id: string;
    fullName: string;
  };
}

export const incidentsApi = {
  getAll: (params?: { status?: string; category?: string; limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const query = queryParams.toString();
    return apiClient.get<Incident[]>(`/incidents${query ? `?${query}` : ''}`);
  },

  getPublic: (params?: { status?: string; category?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return apiClient.get<Incident[]>(`/incidents/public${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => {
    return apiClient.get<Incident>(`/incidents/${id}`);
  },

  create: (data: {
    title: string;
    description: string;
    category: string;
    latitude?: string;
    longitude?: string;
    address?: string;
    evidenceUrls?: string[];
  }) => {
    return apiClient.post<Incident>('/incidents', data);
  },

  update: (id: string, data: {
    status?: string;
    assignedDepartmentId?: string;
    assignedStaffId?: string;
    resolutionDescription?: string;
    resolutionEvidenceUrls?: string[];
  }) => {
    return apiClient.put<Incident>(`/incidents/${id}`, data);
  },

  delete: (id: string) => {
    return apiClient.delete<{ message: string }>(`/incidents/${id}`);
  },
};

