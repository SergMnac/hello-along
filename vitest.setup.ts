import '@testing-library/jest-dom/vitest';
import jsdomGlobal from 'jsdom-global';

if (typeof window === 'undefined') {
  jsdomGlobal();
}
