'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const TOOLS = [
  {
    name: 'Calculadora de Crecimiento',
    description: 'Descubre cuánto dinero está perdiendo tu negocio por no implementar IA.',
    url: 'https://calculadora.beweos.io/',
    icon: 'solar:calculator-outline',
    iconColor: '#F59E0B',
    iconBg: 'rgba(245,158,11,0.08)',
  },
  {
    name: 'Comparador de Competencia',
    description: 'Conoce en qué posición estás frente a tu competencia.',
    url: 'https://comparador.beweos.io/',
    icon: 'solar:chart-square-outline',
    iconColor: '#0EA5E9',
    iconBg: 'rgba(14,165,233,0.08)',
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        backgroundColor: 'transparent',
        border: 0,
        outline: 0,
        boxShadow: 'none',
        padding: scrolled ? '12px 0' : '20px 0',
        transition: 'padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="flex items-center" style={{ padding: '0 12px', gap: 24 }}>
        {/* Logo */}
        <a href="https://www.bewe.io" target="_blank" rel="noopener noreferrer">
          <Image
            src="/bewe-logo.png"
            alt="Bewe"
            width={100}
            height={28}
            style={{ height: 28, width: 'auto' }}
          />
        </a>

        {/* Tools dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              color: '#6B7280',
              backgroundColor: toolsOpen ? 'rgba(0,0,0,0.05)' : 'transparent',
            }}
            onMouseEnter={(e) => { if (!toolsOpen) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
            onMouseLeave={(e) => { if (!toolsOpen) e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Herramientas
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{ transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {toolsOpen && (
            <div
              className="absolute left-0 mt-2 rounded-2xl border border-gray-200 bg-white shadow-xl"
              style={{
                width: 320,
                padding: 0,
                animation: 'fadeIn 0.2s ease-out',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #F3F4F6' }}>
                <p className="font-inter text-base-oscura" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
                  Herramientas gratuitas
                </p>
                <p className="font-inter" style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.4, marginTop: 2 }}>
                  Lleva tu negocio al siguiente nivel
                </p>
              </div>

              {/* Tools list */}
              <div style={{ padding: 8 }}>
                {TOOLS.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-xl px-3 py-3 transition-all hover:bg-gray-50"
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{ width: 40, height: 40, backgroundColor: tool.iconBg, flexShrink: 0 }}
                    >
                      <Icon icon={tool.icon} width={20} height={20} color={tool.iconColor} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="font-inter text-base-oscura" style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>
                        {tool.name}
                      </p>
                      <p className="font-inter" style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.4 }}>
                        {tool.description}
                      </p>
                    </div>
                    <Icon icon="solar:arrow-right-up-outline" width={14} height={14} color="#D1D5DB" style={{ marginTop: 4, flexShrink: 0 }} />
                  </a>
                ))}
              </div>

              {/* Footer hint */}
              <div style={{ padding: '10px 20px', borderTop: '1px solid #F3F4F6', backgroundColor: '#FAFAFA' }}>
                <p className="font-inter" style={{ fontSize: 10, color: '#B0B7C3', textAlign: 'center' }}>
                  Powered by Linda IA
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
