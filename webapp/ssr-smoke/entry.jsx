import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from '../src/App';
import { AppProvider } from '../src/state/AppState';

export function render(path) {
  return renderToString(
    <StaticRouter location={path}>
      <AppProvider>
        <App />
      </AppProvider>
    </StaticRouter>,
  );
}
