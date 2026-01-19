'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Logo } from '@/components/ui/logo';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <Logo size="sm" animated={false} />
              </Link>
              {user && (
                <div className="ml-10 flex items-center space-x-2">
                  <Link
                    href="/dashboard"
                    className={
                      isActive('/dashboard')
                        ? 'bg-primary/10 text-primary rounded-md px-3 py-1.5'
                        : 'text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md px-3 py-1.5 transition-colors'
                    }
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/transactions"
                    className={
                      isActive('/transactions')
                        ? 'bg-primary/10 text-primary rounded-md px-3 py-1.5'
                        : 'text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md px-3 py-1.5 transition-colors'
                    }
                  >
                    Transactions
                  </Link>
                  <Link
                    href="/accounts"
                    className={
                      isActive('/accounts')
                        ? 'bg-primary/10 text-primary rounded-md px-3 py-1.5'
                        : 'text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md px-3 py-1.5 transition-colors'
                    }
                  >
                    Accounts
                  </Link>
                  <Link
                    href="/budgets"
                    className={
                      isActive('/budgets')
                        ? 'bg-primary/10 text-primary rounded-md px-3 py-1.5'
                        : 'text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md px-3 py-1.5 transition-colors'
                    }
                  >
                    Budgets
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">{user.display_name}</span>
                  <Button onClick={logout} variant="ghost" size="sm">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
