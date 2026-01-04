import React from 'react';
import { useThemeSettings } from '../contexts/ThemeSettingsContext';

interface ThemeSettingsDemoProps {
  className?: string;
}

const ThemeSettingsDemo: React.FC<ThemeSettingsDemoProps> = ({ className = '' }) => {
  const { settings, updateSettings, isLoading } = useThemeSettings();

  if (isLoading) {
    return <div className="p-4 text-center">Loading theme settings...</div>;
  }

  const handleColorChange = (colorKey: 'primary_color' | 'secondary_color' | 'background_color' | 'text_color', value: string) => {
    updateSettings('colors', { [colorKey]: value });
  };

  const handleCelebrationIntensityChange = (value: 'subtle' | 'moderate' | 'intense') => {
    updateSettings('game_features', { celebration_intensity: value });
  };

  return (
    <div className={`p-4 border rounded-lg shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Colors</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm mb-1">Primary Color</label>
              <input 
                type="color" 
                value={settings.colors.primary_color}
                onChange={(e) => handleColorChange('primary_color', e.target.value)}
                className="w-full h-8 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Secondary Color</label>
              <input 
                type="color" 
                value={settings.colors.secondary_color}
                onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                className="w-full h-8 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Background Color</label>
              <input 
                type="color" 
                value={settings.colors.background_color}
                onChange={(e) => handleColorChange('background_color', e.target.value)}
                className="w-full h-8 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Text Color</label>
              <input 
                type="color" 
                value={settings.colors.text_color}
                onChange={(e) => handleColorChange('text_color', e.target.value)}
                className="w-full h-8 cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Game Features</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="enable_gameboard"
                checked={settings.game_features.enable_gameboard}
                onChange={(e) => updateSettings('game_features', { enable_gameboard: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="enable_gameboard">Enable Gameboard</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="enable_leaderboard"
                checked={settings.game_features.enable_leaderboard}
                onChange={(e) => updateSettings('game_features', { enable_leaderboard: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="enable_leaderboard">Enable Leaderboard</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="enable_celebrations"
                checked={settings.game_features.enable_celebrations}
                onChange={(e) => updateSettings('game_features', { enable_celebrations: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="enable_celebrations">Enable Celebrations</label>
            </div>
            
            <div className="mt-2">
              <label className="block text-sm mb-1">Celebration Intensity</label>
              <select 
                value={settings.game_features.celebration_intensity}
                onChange={(e) => handleCelebrationIntensityChange(e.target.value as 'subtle' | 'moderate' | 'intense')}
                className="w-full p-2 border rounded"
                disabled={!settings.game_features.enable_celebrations}
              >
                <option value="subtle">Subtle</option>
                <option value="moderate">Moderate</option>
                <option value="intense">Intense</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Social Features</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="enable_connections"
                checked={settings.social_features.enable_connections}
                onChange={(e) => updateSettings('social_features', { enable_connections: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="enable_connections">Enable User Connections</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="enable_sharing"
                checked={settings.social_features.enable_sharing}
                onChange={(e) => updateSettings('social_features', { enable_sharing: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="enable_sharing">Enable Social Sharing</label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 border rounded bg-gray-50">
        <h4 className="font-medium mb-2">Current Theme Preview</h4>
        <div className="flex space-x-2">
          <div 
            className="w-12 h-12 rounded" 
            style={{ backgroundColor: settings.colors.primary_color }}
            title="Primary Color"
          ></div>
          <div 
            className="w-12 h-12 rounded" 
            style={{ backgroundColor: settings.colors.secondary_color }}
            title="Secondary Color"
          ></div>
          <div 
            className="w-12 h-12 rounded flex items-center justify-center" 
            style={{ 
              backgroundColor: settings.colors.background_color,
              color: settings.colors.text_color
            }}
            title="Background & Text Colors"
          >
            Aa
          </div>
        </div>
        <div className="mt-2 text-sm">
          <p><strong>Celebration Intensity:</strong> {settings.game_features.celebration_intensity}</p>
          <p><strong>Features:</strong> 
            {settings.game_features.enable_gameboard ? ' Gameboard' : ''}
            {settings.game_features.enable_leaderboard ? ' Leaderboard' : ''}
            {settings.game_features.enable_celebrations ? ' Celebrations' : ''}
            {settings.social_features.enable_connections ? ' Connections' : ''}
            {settings.social_features.enable_sharing ? ' Sharing' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsDemo;
