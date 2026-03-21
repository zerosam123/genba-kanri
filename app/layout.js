export const metadata = {
  title: '現場表管理',
  description: '建設・工事現場の管理アプリ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
