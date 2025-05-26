import React from 'react';
import LandingPage from './pages/landingpage';
import SignUp from './pages/signup';
import SignIn from './pages/signin';
import IssueForm from './pages/issueform';
import Congratulations from './pages/congratulations';
import StudentDashboard from './pages/StudentDashboard';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Otp from './pages/otp';
import DashboardContent from './pages/Dashboardcontent';
import IssueDetails from './pages/issuedetails';
import Issuemanagement from './pages/Issuemanagement';
import NotificationScreen from './pages/notificationscreen';
import HelpSupport from './pages/helpsupport';
import Settings from './pages/settings';
import Messages from './pages/messages';
import NewMessage from './pages/newmessages';
import Profile from './pages/profile';
import EditProfilePicture from './pages/EditProfilePicture';
import EditPersonalInfo from './pages/EditPersonalInfo';
import EditAcademicInfo from './pages/EditAcademicInfo';      
import RegistrarDashboard from './pages/registrardashboard';
import EmailRequest from './pages/emailrequest';
import ForgotPassword from './pages/forgotpassword';
import LecturerDashboard from './pages/LecturerDashboard';
import RegistrarDashboardContent from './pages/registrardashboardcontent';
import LecturerDashboardContent from './pages/lecturerdashboardcontent';
import OpenIssues from './pages/openissues';
import CourseManagement from './pages/CourseManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import LecturerIssues from './pages/lecturerissues';
import { IssuesProvider } from './context/IssueContext';
import RoleBasedRoute from './components/rolebassedroute';


const App = () => {
  return (
    <IssuesProvider>
      <Routes>
        <Route path="/" index element={<Navigate to="landing" />} />
        <Route path="landing" element={<LandingPage />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="emailrequest" element={<EmailRequest />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="otp" element={<Otp />} />
        <Route path="congs" element={<Congratulations />} />
        <Route path="app" element={<RoleBasedRoute allowedRoles={['student']}>
              <StudentDashboard />
        </RoleBasedRoute>}>
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="notifications" element={<NotificationScreen />} />
          <Route path="issueform" element={<IssueForm />} />
          <Route path="issue/:id" element={<IssueDetails />} />
          <Route path="support" element={<HelpSupport />} />
          <Route path='editpersonalinfo' element={<EditPersonalInfo />} />
          <Route path='editprofilepicture' element={<EditProfilePicture />} />
          <Route path='editacademicinfo' element={<EditAcademicInfo />} />
          <Route path="settings" element={<Settings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="issues" element={<Issuemanagement />} />
        </Route>

        <Route path="registrar-dashboard" element={<RoleBasedRoute allowedRoles={['registrar']}>
              <RegistrarDashboard />
            </RoleBasedRoute>}>
          <Route path="dashboard" element={<RegistrarDashboardContent />} />
          <Route path="openissues" element={<OpenIssues />} />
          <Route path="notifications" element={<NotificationScreen />} />
          <Route path="profile" element={<Profile />} />
          <Route path="support" element={<HelpSupport />} />
          <Route path="settings" element={<Settings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="departments" element={<DepartmentManagement />} />
        </Route>
        <Route path="newmessage" element={<NewMessage />} />

        <Route path="lecturer" element={<RoleBasedRoute allowedRoles={['lecturer']}>
              <LecturerDashboard />
        </RoleBasedRoute>}>
          <Route path="dashboard" element={<LecturerDashboardContent />} />
          <Route path='lecturerissue' element={<LecturerIssues />} />
          <Route path="issue/:id" element={<IssueDetails />} />
          <Route path="notifications" element={<NotificationScreen />} />
          <Route path="profile" element={<Profile />} />
          <Route path="support" element={<HelpSupport />} />
          <Route path="settings" element={<Settings />} />
          <Route path="newmessage" element={<NewMessage />} />
          <Route path="messages" element={<Messages />} />
        </Route>
      </Routes>
    </IssuesProvider>
  );
};



export default App;
