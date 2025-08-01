import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Bot, Calendar, User } from 'lucide-react';

export function NavigationBar() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/exercise-log', icon: Dumbbell, label: 'Exercises' },
    { to: '/workout-log', icon: Calendar, label: 'Workout Log' },
    { to: '/ai-assistant', icon: Bot, label: 'Coach FiTrek' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-white/30 dark:border-gray-700/50 z-50 shadow-large safe-area-inset-bottom">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 xs:py-3 px-1 xs:px-2 sm:py-4 sm:px-3 ${
                  isActive 
                    ? 'text-primary bg-primary/10 dark:bg-primary/20 shadow-glow scale-110' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 hover:scale-105'
                } transition-all duration-300 ease-out rounded-xl mx-0.5 xs:mx-1 group animate-scale-in`
              }
            >
              <Icon className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 mb-0.5 xs:mb-1 transition-all duration-300 group-hover:scale-110 icon-crisp" strokeWidth={1.5} />
              <span className="text-xs font-medium truncate max-w-full transition-all duration-300 group-hover:font-semibold leading-tight">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}