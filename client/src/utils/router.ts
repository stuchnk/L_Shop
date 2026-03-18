type RouteHandler = (params?: Record<string, string>) => void;

interface Route {
  path: string;
  handler: RouteHandler;
}

const routes: Route[] = [];

export const addRoute = (path: string, handler: RouteHandler): void => {
  routes.push({ path, handler });
};

export const navigateTo = (path: string): void => {
  window.history.pushState({}, '', path);
  handleRoute();
};

const matchRoute = (routePath: string, currentPath: string): Record<string, string> | null => {
  const routeParts: string[] = routePath.split('/');
  const pathParts: string[] = currentPath.split('/');

  if (routeParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) {
      params[routeParts[i].slice(1)] = pathParts[i];
    } else if (routeParts[i] !== pathParts[i]) {
      return null;
    }
  }

  return params;
};

export const handleRoute = (): void => {
  const currentPath: string = window.location.pathname;

  for (const route of routes) {
    const params: Record<string, string> | null = matchRoute(route.path, currentPath);
    if (params !== null) {
      route.handler(params);
      return;
    }
  }

  // Дефолт — главная
  const home: Route | undefined = routes.find((r: Route) => r.path === '/');
  if (home) home.handler();
};

export const initRouter = (): void => {
  window.addEventListener('popstate', handleRoute);
  handleRoute();
};