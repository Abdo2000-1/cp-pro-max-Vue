import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Layout from '@/components/layout/Layout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/pages/Orders.vue')
      },
      {
        path: 'orders/create',
        name: 'CreateOrder',
        component: () => import('@/pages/CreateOrder.vue')
      },
      {
        path: 'orders/:orderId',
        name: 'ViewOrder',
        component: () => import('@/pages/ViewOrder.vue')
      },
      {
        path: 'orders/:orderId/edit',
        name: 'EditOrder',
        component: () => import('@/pages/EditOrder.vue')
      },
      {
        path: 'orders/:orderId/workflow',
        name: 'OrderWorkflow',
        component: () => import('@/pages/OrderWorkflow.vue')
      },
      {
        path: 'orders/:orderId/files',
        name: 'OrderFiles',
        component: () => import('@/pages/OrderFiles.vue')
      },
      {
        path: 'orders/:orderId/sub-orders/:subOrderId',
        name: 'SubOrderDetail',
        component: () => import('@/pages/SubOrderDetail.vue')
      },
      {
        path: 'cases',
        name: 'Cases',
        component: () => import('@/pages/Cases.vue')
      },
      {
        path: 'cases/:caseId',
        name: 'CaseDetails',
        component: () => import('@/pages/CaseDetails.vue')
      },
      {
        path: 'patients',
        name: 'Patients',
        component: () => import('@/pages/Patients.vue')
      },
      {
        path: 'patients/:patientId',
        name: 'PatientDetails',
        component: () => import('@/pages/PatientDetails.vue')
      },
      {
        path: 'doctors',
        name: 'Doctors',
        component: () => import('@/pages/Doctors.vue')
      },
      {
        path: 'doctors/:doctorId',
        name: 'DoctorDetails',
        component: () => import('@/pages/DoctorDetails.vue')
      },
      {
        path: 'clinics',
        name: 'Clinics',
        component: () => import('@/pages/Clinics.vue')
      },
      {
        path: 'clinics/:clinicId',
        name: 'ClinicDetails',
        component: () => import('@/pages/ClinicDetails.vue')
      },
      {
        path: 'billing',
        name: 'Billing',
        component: () => import('@/pages/Billing.vue')
      },
      {
        path: 'grid',
        name: 'Grid',
        component: () => import('@/pages/Grid.vue')
      },
      {
        path: 'forms',
        name: 'Forms',
        component: () => import('@/pages/Forms.vue')
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/pages/Reports.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/Settings.vue')
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('@/pages/Notifications.vue')
      },
      {
        path: 'change-requests',
        name: 'ChangeRequests',
        component: () => import('@/pages/ChangeRequests.vue')
      },
      {
        path: 'scan-center',
        name: 'ScanCenter',
        component: () => import('@/pages/ScanCenter.vue')
      },
      {
        path: 'workflow-board',
        name: 'WorkflowBoard',
        component: () => import('@/pages/WorkflowBoard.vue')
      },
      {
        path: 'documents',
        name: 'Documents',
        component: () => import('@/pages/Documents.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
