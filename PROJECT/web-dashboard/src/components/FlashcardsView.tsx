'use client';

import React, { useState } from 'react';
import { 
  BrainCircuit, 
  RotateCw, 
  Check, 
  X as XIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  BookOpen,
  Award
} from 'lucide-react';
import { FLASHCARDS, Flashcard } from '../data/academicData';

export const FlashcardsView: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>(FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'OS & Systems', 'Algorithms', 'DBMS', 'Networks'];

  const filteredCards = selectedCategory === 'All'
    ? cards
    : cards.filter((c) => c.category === selectedCategory);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const markMastered = () => {
    if (currentCard && !masteredIds.includes(currentCard.id)) {
      setMasteredIds([...masteredIds, currentCard.id]);
    }
    handleNext();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      
      {/* Category selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: selectedCategory === cat ? 'var(--grad-purple-pink)' : 'transparent',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Mastered: <strong style={{ color: 'var(--accent-emerald)' }}>{masteredIds.length}</strong> / {cards.length}
        </div>
      </div>

      {/* Main Flashcard Display */}
      {currentCard && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="glass-panel"
            style={{
              minHeight: '320px',
              padding: '40px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: isFlipped ? '1px solid var(--accent-purple)' : '1px solid var(--border-glow)',
              boxShadow: isFlipped ? '0 0 30px rgba(184, 41, 221, 0.25)' : 'var(--shadow-glow-cyan)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {currentCard.courseCode}
                </span>
                <span className="badge badge-purple">{currentCard.category}</span>
              </div>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Card {currentIndex + 1} of {filteredCards.length}
              </span>
            </div>

            {/* Content Area */}
            <div style={{ textAlign: 'center', margin: '30px 0' }}>
              {!isFlipped ? (
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                    [ Question - Click to Reveal Answer ]
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.5 }}>
                    {currentCard.question}
                  </h3>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                    [ Core Concept Answer ]
                  </div>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
                    {currentCard.answer}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom hint */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <RotateCw size={13} />
              <span>Tap to flip card</span>
            </div>
          </div>

          {/* Navigation and Rating Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <button
              onClick={handlePrev}
              className="btn btn-outline"
              style={{ padding: '10px 18px' }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleNext}
                className="btn btn-outline"
                style={{ padding: '10px 16px', color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
              >
                <XIcon size={16} /> Need Review
              </button>
              <button
                onClick={markMastered}
                className="btn btn-primary"
                style={{ padding: '10px 18px' }}
              >
                <Check size={16} /> Got It Right
              </button>
            </div>

            <button
              onClick={handleNext}
              className="btn btn-outline"
              style={{ padding: '10px 18px' }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
