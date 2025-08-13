/**
 * Dynamic Spacing Configuration Utility
 * Allows runtime adjustment of text spacing and readability settings
 */

export interface SpacingConfig {
  textSpacingMultiplier: number;
  borderOpacity: number;
  borderHoverOpacity: number;
  letterSpacingBase: number;
  wordSpacingBase: number;
}

const DEFAULT_CONFIG: SpacingConfig = {
  textSpacingMultiplier: 1,
  borderOpacity: 0.2,
  borderHoverOpacity: 0.4,
  letterSpacingBase: 0.01,
  wordSpacingBase: 0.1,
};

class SpacingConfigManager {
  private config: SpacingConfig = { ...DEFAULT_CONFIG };
  private root: HTMLElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.root = document.documentElement;
      this.applyConfig();
    }
  }

  /**
   * Update the spacing configuration
   */
  updateConfig(newConfig: Partial<SpacingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.applyConfig();
  }

  /**
   * Get current configuration
   */
  getConfig(): SpacingConfig {
    return { ...this.config };
  }

  /**
   * Reset to default configuration
   */
  resetToDefault(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.applyConfig();
  }

  /**
   * Apply configuration to CSS custom properties
   */
  private applyConfig(): void {
    if (!this.root) return;

    // Update CSS custom properties
    this.root.style.setProperty('--text-spacing-multiplier', this.config.textSpacingMultiplier.toString());
    this.root.style.setProperty('--border-opacity', this.config.borderOpacity.toString());
    this.root.style.setProperty('--border-hover-opacity', this.config.borderHoverOpacity.toString());
    this.root.style.setProperty('--letter-spacing-base', `${this.config.letterSpacingBase}em`);
    this.root.style.setProperty('--word-spacing-base', `${this.config.wordSpacingBase}em`);
  }

  /**
   * Preset configurations for different readability levels
   */
  applyPreset(preset: 'compact' | 'normal' | 'comfortable' | 'spacious' | 'extra-spacious'): void {
    const presets: Record<string, Partial<SpacingConfig>> = {
      compact: {
        textSpacingMultiplier: 0.8,
        borderOpacity: 0.15,
        borderHoverOpacity: 0.3,
        letterSpacingBase: 0.005,
        wordSpacingBase: 0.05,
      },
      normal: {
        textSpacingMultiplier: 1,
        borderOpacity: 0.2,
        borderHoverOpacity: 0.4,
        letterSpacingBase: 0.01,
        wordSpacingBase: 0.1,
      },
      comfortable: {
        textSpacingMultiplier: 1.2,
        borderOpacity: 0.25,
        borderHoverOpacity: 0.45,
        letterSpacingBase: 0.015,
        wordSpacingBase: 0.15,
      },
      spacious: {
        textSpacingMultiplier: 1.5,
        borderOpacity: 0.3,
        borderHoverOpacity: 0.5,
        letterSpacingBase: 0.02,
        wordSpacingBase: 0.2,
      },
      'extra-spacious': {
        textSpacingMultiplier: 2,
        borderOpacity: 0.35,
        borderHoverOpacity: 0.6,
        letterSpacingBase: 0.03,
        wordSpacingBase: 0.3,
      },
    };

    if (presets[preset]) {
      this.updateConfig(presets[preset]);
    }
  }

  /**
   * Save current configuration to localStorage
   */
  saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('spacing-config', JSON.stringify(this.config));
    }
  }

  /**
   * Load configuration from localStorage
   */
  loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spacing-config');
      if (saved) {
        try {
          const config = JSON.parse(saved) as SpacingConfig;
          this.updateConfig(config);
        } catch (error) {
          console.warn('Failed to load spacing config from storage:', error);
        }
      }
    }
  }
}

// Export singleton instance
export const spacingConfig = new SpacingConfigManager();

// Export utility functions
export const {
  updateConfig: updateSpacingConfig,
  getConfig: getSpacingConfig,
  resetToDefault: resetSpacingConfig,
  applyPreset: applySpacingPreset,
  saveToStorage: saveSpacingConfig,
  loadFromStorage: loadSpacingConfig,
} = spacingConfig;

// Auto-load from storage on initialization
if (typeof window !== 'undefined') {
  spacingConfig.loadFromStorage();
}