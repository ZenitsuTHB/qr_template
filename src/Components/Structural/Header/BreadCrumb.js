// Breadcrumb.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/breadcrumb.css';
import routesConfig from '../../../Config/sidebarConfig'; // Adjust the import path accordingly

/**
 * Utility function to recursively find a route by its path.
 * @param {string} path - The path to search for.
 * @param {Array} routes - The routes configuration array.
 * @returns {object|null} - The matched route object or null if not found.
 */
const findRoute = (path, routes) => {
  for (const route of routes) {
    const normalizedRoutePath = route.path.replace(/\/+$/, '');
    if (normalizedRoutePath === path) {
      return route;
    }
    if (route.children) {
      const found = findRoute(path, route.children);
      if (found) return found;
    }
  }
  return null;
};

const Breadcrumb = ({ title }) => { // Destructure title from props
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    const route = findRoute(to, routesConfig);
    return {
      label: route ? route.label : decodeURIComponent(value),
      path: to,
    };
  });

  let displayedBreadcrumbs = [];

  if (breadcrumbs.length === 0) {
    // On root path, show only 'Mateza Booking'
    displayedBreadcrumbs = [
      {
        label: 'Mateza Booking',
        path: '/',
      },
    ];
  } else if (breadcrumbs.length === 1) {
    // Single segment path: Root + segment
    displayedBreadcrumbs = [
      {
        label: 'Mateza Booking',
        path: '/',
      },
      breadcrumbs[0],
    ];
  } else {
    // Multi-segment path: Show last two segments
    displayedBreadcrumbs = breadcrumbs.slice(-2);
  }

  return (
    <div className="breadcrumb-component">
      <nav className="breadcrumb" aria-label="breadcrumb">
        {displayedBreadcrumbs.map((crumb, index) => {
          const isLast = index === displayedBreadcrumbs.length - 1;
          const isFirst = index === 0;
          const isRoot = breadcrumbs.length === 0; // Determine if on root path

          return (
            <span key={crumb.path} className="breadcrumb-item">
              {!isLast ? (
                <>
                  <Link
                    to={crumb.path}
                    className={`breadcrumb-link ${isFirst ? 'breadcrumb-link-blue' : ''}`}
                  >
                    {crumb.label}
                  </Link>
                  <span className="breadcrumb-separator">/</span>
                </>
              ) : (
                <span className="breadcrumb-current">
                  {isRoot ? crumb.label : title}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumb;
