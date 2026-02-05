import React, { useState, useEffect } from 'react';

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiModal: React.FC<ApiModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKeyState] = useState(() => {
    return localStorage.getItem('geminiApiKey') || '';
  });
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('geminiApiKey') || '';
      setApiKeyState(savedKey);
      setTempApiKey(savedKey);
    }
  }, [isOpen]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const testConnection = async () => {
    if (!tempApiKey.trim()) {
      setConnectionStatus('error');
      setErrorMessage('API 키를 입력해주세요.');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${tempApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: 'Hello' }]
            }]
          })
        }
      );

      if (response.ok) {
        setConnectionStatus('success');
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setConnectionStatus('error');
        setErrorMessage(errorData.error?.message || 'API 키가 유효하지 않습니다.');
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage('연결 테스트 중 오류가 발생했습니다.');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = () => {
    if (connectionStatus === 'success') {
      setApiKeyState(tempApiKey);
      localStorage.setItem('geminiApiKey', tempApiKey);
      onClose();
    }
  };

  const handleClose = () => {
    const savedKey = localStorage.getItem('geminiApiKey') || '';
    setTempApiKey(savedKey);
    setConnectionStatus('idle');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
         onClick={handleClose}>
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#1a130a] via-[#0f0a05] to-black rounded-2xl shadow-[0_20px_60px_rgba(251,191,36,0.3)] p-6 sm:p-8 border-2 border-amber-900/40"
           onClick={(e) => e.stopPropagation()}
           style={{
             boxShadow: `
               0 0 40px rgba(251, 191, 36, 0.25),
               0 20px 60px rgba(0,0,0,0.9),
               inset 0 0 60px rgba(251, 191, 36, 0.08)
             `
           }}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-amber-400 hover:text-amber-300 transition-all duration-200 rounded-full hover:bg-amber-900/30 border border-amber-900/40 hover:border-amber-800/60"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Decorative Corner Symbols */}
        <div className="absolute top-3 left-3 text-amber-600/40 text-lg">✦</div>
        <div className="absolute bottom-3 right-3 text-amber-600/40 text-lg">✦</div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"
            style={{
              textShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3), 2px 2px 4px rgba(0,0,0,0.8)',
              fontFamily: 'serif'
            }}>
          API 연결 설정
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-amber-600/60 to-transparent mx-auto mb-6"></div>

        {/* API Key Input */}
        <div className="mb-5">
          <label className="block text-sm font-bold text-amber-300 mb-2.5"
                 style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
            Gemini API 키
          </label>
          <input
            type="password"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="AIza..."
            className="w-full px-4 py-3 text-sm
                       bg-gradient-to-br from-[#d4c5ab] to-[#c9b59a]
                       border-2 border-amber-600/50
                       rounded-lg
                       text-amber-950 font-semibold
                       placeholder:text-amber-800/50
                       focus:outline-none focus:ring-2 focus:ring-amber-500/70 focus:border-amber-500
                       shadow-[0_2px_8px_rgba(0,0,0,0.4)]
                       hover:shadow-[0_4px_12px_rgba(251,191,36,0.3)]
                       transition-all duration-200"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(139, 115, 85, 0.08) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(101, 67, 33, 0.06) 0%, transparent 40%)
              `
            }}
          />
        </div>

        {/* Connection Status */}
        {connectionStatus === 'success' && (
          <div className="mb-4 p-3 bg-gradient-to-r from-green-900/30 to-green-800/30 border-2 border-green-600/50 rounded-lg flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-300 font-bold" style={{ textShadow: '0 0 10px rgba(34,197,94,0.5)' }}>연결 성공!</span>
          </div>
        )}

        {connectionStatus === 'error' && (
          <div className="mb-4 p-3 bg-gradient-to-r from-red-900/30 to-red-800/30 border-2 border-red-600/50 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <p className="text-sm text-red-300 font-bold" style={{ textShadow: '0 0 10px rgba(239,68,68,0.5)' }}>{errorMessage}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={testConnection}
            disabled={isTestingConnection || !tempApiKey.trim()}
            className="flex-1 px-4 py-3 text-sm font-bold tracking-wide
                       bg-gradient-to-r from-blue-900/70 to-blue-800/70
                       hover:from-blue-800/80 hover:to-blue-700/80
                       text-blue-200 hover:text-blue-100
                       border-2 border-blue-700/50 hover:border-blue-600/70
                       rounded-lg
                       shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-300"
            style={{
              backdropFilter: 'blur(4px)',
              textShadow: '0 0 10px rgba(59, 130, 246, 0.5), 1px 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            {isTestingConnection ? '테스트 중...' : '연결 테스트'}
          </button>

          <button
            onClick={handleSave}
            disabled={connectionStatus !== 'success'}
            className="flex-1 px-4 py-3 text-sm font-bold tracking-wide
                       bg-gradient-to-r from-amber-900/70 to-amber-800/70
                       hover:from-amber-800/80 hover:to-amber-700/80
                       text-amber-200 hover:text-amber-100
                       border-2 border-amber-700/50 hover:border-amber-600/70
                       rounded-lg
                       shadow-lg hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-300"
            style={{
              backdropFilter: 'blur(4px)',
              textShadow: '0 0 10px rgba(251, 191, 36, 0.5), 1px 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            저장
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-center text-amber-400/70"
           style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.2), 1px 1px 2px rgba(0,0,0,0.6)' }}>
          API 키는{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 underline hover:text-amber-200 transition-colors"
          >
            Google AI Studio
          </a>
          에서 발급받을 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default ApiModal;
