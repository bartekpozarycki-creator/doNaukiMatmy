import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { TaskProgressProvider } from '@/contexts/TaskProgressContext';
import '@/index.css'
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/supabase-config.js';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <SessionContextProvider supabaseClient={supabase}>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <FavoritesProvider>
                        <TaskProgressProvider>
                            <App />
                        </TaskProgressProvider>
                    </FavoritesProvider>
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    </SessionContextProvider>
) 