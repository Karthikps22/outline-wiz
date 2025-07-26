
const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const apiService = {
  async getSuggestions(query: string): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/suggest-topics?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    
    const data = await response.json();
    return data.suggestions || [];
  },

  async generateOutline(payload: {
    topic: string;
    output_type: string;
    audience: string;
    tone: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/generate-outline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to generate outline');
    }

    return response.json();
  }
};
