import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SiteShell from './site/SiteShell';
import { parseSiteLocation } from './site/routing';
import { applySeo } from './site/seo';

function App() {
  const location = useLocation();
  const route = useMemo(() => parseSiteLocation(location.pathname), [location.pathname]);

  useEffect(() => {
    document.documentElement.lang = route.locale;
    applySeo(route);
  }, [route]);

  return <SiteShell context={route} />;
}

export default App;
