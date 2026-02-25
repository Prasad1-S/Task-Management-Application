export const metadata = {
  title: 'TaskFlow — Task Management',
  description: 'A fast, focused task manager for individuals.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0a0a0a' }}>
        {children}
      </body>
    </html>
  );
}