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
        redirect: '/flow'
      },
      // The 8 Target Modernized Pages
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue')
      },
      {
        path: 'flow',
        name: 'Flow',
        component: () => import('@/pages/Flow.vue')
      },
      {
        path: 'orders',
        redirect: '/flow'
      },
      {
        path: 'add-case',
        name: 'AddCase',
        component: () => import('@/pages/AddCase.vue')
      },
      {
        path: 'order-details',
        name: 'OrderDetails',
        component: () => import('@/pages/OrderDetails.vue')
      },
      {
        path: 'quarter-targets',
        name: 'QuarterTargets',
        component: () => import('@/pages/QuarterTargetsReport.vue')
      },
      {
        path: 'task-47',
        name: 'Task47',
        component: () => import('@/pages/Task47ModelWorkReport.vue')
      },
      {
        path: 'task-31',
        name: 'Task31',
        component: () => import('@/pages/Task31StaffTargets.vue')
      },
      {
        path: 'edit-case',
        name: 'EditCase',
        component: () => import('@/pages/EditCasePage.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/Profile.vue')
      },

      // Analytics & Odontogram Auxiliary Pages
      {
        path: 'powerbi',
        name: 'PowerBI',
        component: () => import('@/pages/PowerBI.vue')
      },
      {
        path: 'teeth-chart',
        name: 'TeethChart',
        component: () => import('@/pages/TeethChartPage.vue')
      },

      // Auxiliary ERP & CRM Routes
      {
        path: 'orders/create',
        name: 'CreateOrder',
        component: () => import('@/pages/AddCase.vue')
      },
      {
        path: 'orders/:orderId',
        name: 'ViewOrder',
        component: () => import('@/pages/ViewOrder.vue')
      },
      {
        path: 'orders/:orderId/edit',
        name: 'EditOrder',
        component: () => import('@/pages/EditCasePage.vue')
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
    redirect: '/flow'
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
