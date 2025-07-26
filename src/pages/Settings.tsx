
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UserPreferences {
  defaultTone: string;
  defaultOutputType: string;
  defaultAudience: string;
  darkMode: boolean;
  competitorMode: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultTone: '',
    defaultOutputType: '',
    defaultAudience: '',
    darkMode: false,
    competitorMode: false,
  });

  useEffect(() => {
    // Load preferences from localStorage
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const updatePreference = (key: keyof UserPreferences, value: string | boolean) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    localStorage.setItem('userPreferences', JSON.stringify(updated));
  };

  const saveSettings = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully',
    });
  };

  const resetSettings = () => {
    const defaultPrefs: UserPreferences = {
      defaultTone: '',
      defaultOutputType: '',
      defaultAudience: '',
      darkMode: false,
      competitorMode: false,
    };
    setPreferences(defaultPrefs);
    localStorage.setItem('userPreferences', JSON.stringify(defaultPrefs));
    
    toast({
      title: 'Settings reset',
      description: 'All preferences have been reset to defaults',
    });
  };

  const outputTypes = [
    { value: 'outline', label: 'Outline Only' },
    { value: 'outline-brief', label: 'Outline + Content Brief' },
    { value: 'outline-brief-intro', label: 'Outline + Brief + Intro Paragraph' }
  ];

  const audiences = [
    { value: 'general', label: 'General' },
    { value: 'tech-savvy', label: 'Tech-savvy' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'students', label: 'Students' },
    { value: 'professionals', label: 'Professionals' }
  ];

  const tones = [
    { value: 'friendly', label: 'Friendly' },
    { value: 'formal', label: 'Formal' },
    { value: 'technical', label: 'Technical' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'conversational', label: 'Conversational' }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings & Preferences</h1>
          <p className="text-muted-foreground">Customize your outline generation experience</p>
        </div>

        <div className="space-y-6">
          {/* Default Preferences */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Default Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Default Output Type
                </label>
                <Select 
                  value={preferences.defaultOutputType} 
                  onValueChange={(value) => updatePreference('defaultOutputType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default output type" />
                  </SelectTrigger>
                  <SelectContent>
                    {outputTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Default Target Audience
                </label>
                <Select 
                  value={preferences.defaultAudience} 
                  onValueChange={(value) => updatePreference('defaultAudience', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((aud) => (
                      <SelectItem key={aud.value} value={aud.value}>
                        {aud.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Default Content Tone
                </label>
                <Select 
                  value={preferences.defaultTone} 
                  onValueChange={(value) => updatePreference('defaultTone', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Dark Theme</label>
                <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
              </div>
              <Switch
                checked={preferences.darkMode}
                onCheckedChange={(checked) => updatePreference('darkMode', checked)}
              />
            </div>
          </Card>

          {/* Advanced Features */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Advanced Features</h2>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Competitor-Aware Mode</label>
                <p className="text-sm text-muted-foreground">Include competitor analysis in outline generation (coming soon)</p>
              </div>
              <Switch
                checked={preferences.competitorMode}
                onCheckedChange={(checked) => updatePreference('competitorMode', checked)}
                disabled
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={resetSettings}>
              Reset to Defaults
            </Button>
            <Button onClick={saveSettings}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
