import Layout from '@/layout/layout.jsx';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

import './theme-config.css';

export default function App() {
  return (
    <>
      <Theme
        appearance="dark"
        accentColor="indigo"
        radius="large"
        panelBackground="translucent"
        scaling="100%"
      >
        <div id="main-container">
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </div>
      </Theme>
    </>
  );
}
