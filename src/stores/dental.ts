import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  Order, Patient, Doctor, Clinic, Case, BillingRecord, 
  ChangeRequest, Notification, ScanCenter, ReportsData, 
  MonthlyVolume, OrderStatus, Priority, UserProfile, OrdersViewState 
} from '@/types';
import { api } from '@/services/api';
import { sound } from '@/utils/sound';

const STORAGE_PREFIX = 'dentalab_vue_store_';

export const useDentalStore = defineStore('dental', () => {
  // --- STATE ---
  const initialized = ref(false);
  const isLoading = ref(false);
  const uiState = ref<OrdersViewState>('normal');
  const theme = ref<'light' | 'dark' | 'crimson' | 'system'>('dark');
  const soundEnabled = ref(true);

  const orders = ref<Order[]>([]);
  const patients = ref<Patient[]>([]);
  const doctors = ref<Doctor[]>([]);
  const clinics = ref<Clinic[]>([]);
  const cases = ref<Case[]>([]);
  const billing = ref<BillingRecord[]>([]);
  const changeRequests = ref<ChangeRequest[]>([]);
  const notifications = ref<Notification[]>([]);
  const scanCenters = ref<ScanCenter[]>([]);
  const reports = ref<ReportsData | null>(null);
  const volume = ref<MonthlyVolume[]>([]);

  const profile = ref<UserProfile>({
    firstName: 'Dr. Evan',
    lastName: 'Vance',
    email: 'e.vance@dental-vue.com',
    phone: '+1 (555) 349-8821',
    role: 'Chief Dental Technologist',
    specialty: '3D CAD/CAM Prosthodontics & Vue Odontology',
    licenseNumber: 'VUE-DNT-9824',
    avatarInitials: 'EV',
    bio: 'Pioneering next-gen dental CAD designs with Vue 3 reactive workflows.',
    avatarColor: 'from-emerald-500 to-teal-700',
  });

  // --- LOCAL STORAGE HELPERS ---
  const getStorage = <T>(key: string): T | null => {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const setStorage = (key: string, data: any): void => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage error:', e);
    }
  };

  // --- INITIALIZATION ---
  const init = async () => {
    if (initialized.value) return;
    isLoading.value = true;

    try {
      // 1. Theme initialization
      const savedTheme = localStorage.getItem('dentalab-vue-theme') as any;
      if (savedTheme && ['light', 'dark', 'crimson', 'system'].includes(savedTheme)) {
        theme.value = savedTheme;
      } else {
        theme.value = 'dark';
      }
      applyTheme(theme.value);

      // 2. Sound initialization
      soundEnabled.value = sound.isEnabled();

      // 3. Load Storage / API data
      const savedOrders = getStorage<Order[]>('orders');
      const savedPatients = getStorage<Patient[]>('patients');
      const savedDoctors = getStorage<Doctor[]>('doctors');
      const savedClinics = getStorage<Clinic[]>('clinics');
      const savedCases = getStorage<Case[]>('cases');
      const savedBilling = getStorage<BillingRecord[]>('billing');
      const savedCRs = getStorage<ChangeRequest[]>('changeRequests');
      const savedNotifs = getStorage<Notification[]>('notifications');
      const savedCenters = getStorage<ScanCenter[]>('scanCenters');
      const savedReports = getStorage<ReportsData>('reports');
      const savedVolume = getStorage<MonthlyVolume[]>('volume');
      const savedProfile = getStorage<UserProfile>('profile');

      orders.value = savedOrders || await api.getOrders();
      patients.value = savedPatients || await api.getPatients();
      doctors.value = savedDoctors || await api.getDoctors();
      clinics.value = savedClinics || await api.getClinics();
      cases.value = savedCases || await api.getCases();
      billing.value = savedBilling || await api.getBilling();
      changeRequests.value = savedCRs || await api.getChangeRequests();
      notifications.value = savedNotifs || await api.getNotifications();
      scanCenters.value = savedCenters || await api.getScanCenters();
      reports.value = savedReports || await api.getReports();
      volume.value = savedVolume || await api.getDashboardVolume();

      if (savedProfile) {
        profile.value = { ...profile.value, ...savedProfile };
      }

      initialized.value = true;
    } catch (err) {
      console.error('Failed to init Vue Dental store:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // --- THEME MANAGEMENT ---
  const applyTheme = (targetTheme: 'light' | 'dark' | 'crimson' | 'system') => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.removeAttribute('data-theme');

    let resolved = targetTheme;
    if (targetTheme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (resolved === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (resolved === 'crimson') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'crimson');
    } else {
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    }
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'crimson' | 'system') => {
    theme.value = newTheme;
    localStorage.setItem('dentalab-vue-theme', newTheme);
    applyTheme(newTheme);
    sound.playClick();
  };

  const toggleSound = () => {
    soundEnabled.value = !soundEnabled.value;
    sound.setEnabled(soundEnabled.value);
    if (soundEnabled.value) sound.playSuccess();
  };

  const setUiState = (state: OrdersViewState) => {
    uiState.value = state;
  };

  // --- ACTIONS: ORDERS ---
  const addOrder = (order: Order) => {
    orders.value.unshift(order);
    setStorage('orders', orders.value);
    sound.playSuccess();

    // Trigger auto notification
    addNotification({
      id: `notif-${Date.now()}`,
      type: 'order',
      title: `Order Created: #${order.orderNumber}`,
      message: `New order for patient ${order.patientName} (${order.restoration}) submitted.`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: order.id,
      relatedType: 'order'
    });
  };

  const updateOrder = (id: string, partial: Partial<Order>) => {
    const idx = orders.value.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders.value[idx] = { ...orders.value[idx], ...partial, updatedAt: new Date().toISOString() };
      setStorage('orders', orders.value);
      sound.playClick();
    }
  };

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    const idx = orders.value.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders.value[idx].status = newStatus;
      orders.value[idx].updatedAt = new Date().toISOString();
      setStorage('orders', orders.value);
      sound.playPop();

      addNotification({
        id: `notif-${Date.now()}`,
        type: 'workflow',
        title: `Status Updated: #${orders.value[idx].orderNumber}`,
        message: `Case moved to stage: ${newStatus}`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: id
      });
    }
  };

  const deleteOrder = (id: string) => {
    orders.value = orders.value.filter(o => o.id !== id);
    setStorage('orders', orders.value);
    sound.playClick();
  };

  // --- ACTIONS: NOTIFICATIONS ---
  const addNotification = (notif: Notification) => {
    notifications.value.unshift(notif);
    setStorage('notifications', notifications.value);
  };

  const markNotificationRead = (id: string) => {
    const n = notifications.value.find(item => item.id === id);
    if (n) {
      n.read = true;
      setStorage('notifications', notifications.value);
    }
  };

  const markAllNotificationsRead = () => {
    notifications.value.forEach(n => n.read = true);
    setStorage('notifications', notifications.value);
    sound.playClick();
  };

  // --- ACTIONS: PROFILE ---
  const updateProfile = (data: Partial<UserProfile>) => {
    profile.value = { ...profile.value, ...data };
    setStorage('profile', profile.value);
    sound.playSuccess();
  };

  // --- ACTIONS: PATIENTS & DOCTORS ---
  const createPatient = (data: Partial<Patient>) => {
    const newPt: Patient = {
      id: `pt-${Date.now()}`,
      name: data.name || 'New Patient',
      dob: data.dob || '1990-01-01',
      gender: data.gender || 'F',
      phone: data.phone || '',
      email: data.email || '',
      clinicId: data.clinicId || 'cln-1',
      clinicName: data.clinicName || 'Metro Dental Clinic',
      doctorId: data.doctorId || 'doc-1',
      doctorName: data.doctorName || 'Dr. Marcus Webb',
      status: data.status || 'Active',
      ordersCount: 0,
      createdAt: new Date().toISOString()
    };
    patients.value.unshift(newPt);
    setStorage('patients', patients.value);
    sound.playSuccess();
    return newPt;
  };

  const createDoctor = (data: Partial<Doctor>) => {
    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name: data.name || 'New Doctor',
      email: data.email || '',
      phone: data.phone || '',
      specialty: data.specialty || 'General Dentist',
      clinicId: data.clinicId || 'cln-1',
      clinicName: data.clinicName || 'Metro Dental Clinic',
      activeCases: 1,
      status: data.status || 'Active',
      avatarInitials: data.name ? data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'MD',
      createdAt: new Date().toISOString()
    };
    doctors.value.unshift(newDoc);
    setStorage('doctors', doctors.value);
    sound.playSuccess();
    return newDoc;
  };

  const createNotification = (data: { type: any; title: string; message: string; relatedId?: string }) => {
    const newN: Notification = {
      id: `notif-${Date.now()}`,
      type: data.type,
      title: data.title,
      message: data.message,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: data.relatedId
    };
    addNotification(newN);
  };

  // --- GETTERS ---
  const getOrderById = (id: string): Order | undefined => orders.value.find(o => o.id === id || o.orderNumber === id);
  const getPatientById = (id: string): Patient | undefined => patients.value.find(p => p.id === id);
  const getDoctorById = (id: string): Doctor | undefined => doctors.value.find(d => d.id === id);
  const getClinicById = (id: string): Clinic | undefined => clinics.value.find(c => c.id === id);
  const getCaseById = (id: string): Case | undefined => cases.value.find(c => c.id === id);

  const getOrders = () => orders.value;
  const getPatients = () => patients.value;
  const getDoctors = () => doctors.value;
  const getClinics = () => clinics.value;
  const getCases = () => cases.value;
  const getBilling = () => billing.value;

  const unreadNotificationsCount = computed(() => {
    return notifications.value.filter(n => !n.read).length;
  });

  const dashboardStats = computed(() => {
    const totalOrders = orders.value.length;
    const inProgress = orders.value.filter(o => ['Review', 'Design', 'Production', 'Quality Check'].includes(o.status)).length;
    const completed = orders.value.filter(o => ['Ready', 'Completed'].includes(o.status)).length;
    const urgentCount = orders.value.filter(o => o.priority === 'Urgent').length;
    const totalRevenue = orders.value.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const pendingBills = billing.value.filter(b => b.status === 'Pending' || b.status === 'Invoiced').length;

    return {
      totalOrders,
      inProgress,
      completed,
      urgentCount,
      revenue: totalRevenue,
      pendingBills,
      avgTurnaroundDays: 3.4
    };
  });

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  };

  const createOrder = (orderData: any) => {
    return addOrder(orderData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_PREFIX + 'token');
  };

  return {
    // State
    initialized,
    isLoading,
    uiState,
    theme,
    soundEnabled,
    orders,
    patients,
    doctors,
    clinics,
    cases,
    billing,
    changeRequests,
    notifications,
    scanCenters,
    reports,
    volume,
    profile,

    // Actions
    init,
    setTheme,
    toggleSound,
    setUiState,
    addOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    addNotification,
    createNotification,
    markNotificationRead,
    markAllNotificationsRead,
    createPatient,
    createDoctor,
    updateProfile,
    toggleTheme,
    createOrder,
    logout,

    // Getters
    getOrderById,
    getPatientById,
    getDoctorById,
    getClinicById,
    getCaseById,
    getOrders,
    getPatients,
    getDoctors,
    getClinics,
    getCases,
    getBilling,
    unreadNotificationsCount,
    dashboardStats
  };
});
