import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AdminDashboard from '../../components/AdminDashboard/AdminDashboard';
import { AdminCallback } from '../../components/AdminCallback/AdminCallback';
import { AdminErrorBoundary } from '../../components/ErrorBoundary/AdminErrorBoundary';

/**
 * AdminPage component handles admin routing and authentication flow
 * Provides routes for admin dashboard and OAuth callback
 */
const AdminPage: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <AdminErrorBoundary>
      <Switch>
        {/* OAuth callback route */}
        <Route exact path={`${path}/callback`}>
          <AdminCallback />
        </Route>
        
        {/* Main admin dashboard route */}
        <Route exact path={path}>
          <AdminDashboard />
        </Route>
      </Switch>
    </AdminErrorBoundary>
  );
};

export default AdminPage;