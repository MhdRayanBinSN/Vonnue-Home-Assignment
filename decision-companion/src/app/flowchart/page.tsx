'use client';

import React from 'react';
import { DecisionFlowchart } from '@/components/DecisionFlowchart';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FlowchartPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="text-sm font-medium">Back to App</span>
                            </Link>
                        </div>
                        <h1 className="text-lg font-bold text-slate-800">How It Works</h1>
                        <div className="w-20" />
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <DecisionFlowchart />
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white mt-8">
                <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-slate-500">
                    Decision Companion System — Decision Logic Flowchart
                </div>
            </footer>
        </div>
    );
}
