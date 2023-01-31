import React from 'react';
import App from './App';

export default function Layout(props) {
  const { injectScript, injectCss, injectState } = props;
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        {injectCss}
      </head>
      <body>
        <div id="app"><App {...props} /></div>
        {injectState}
        {injectScript}
      </body>
    </html>
  );
}