import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useAI } from '../../contexts/AIContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Brain,
  Settings,
  Languages,
} from 'react-native-vector-icons/Feather';
import { theme, spacing, borderRadius } from '../../theme';
import Voice from '@react-native-voice/voice';
import { Audio } from 'expo-av';

const AICounselorScreen = () => {
  const { messages, isLoading, sendMessage, processVoiceInput, generateVoiceOutput } = useAI();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const supportedLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ];

  useEffect(() => {
    // Initialize voice recognition
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = handleSpeechResults;
    Voice.onSpeechError = handleSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSpeechResults = (event: any) => {
    if (event.value && event.value.length > 0) {
      const transcribedText = event.value[0];
      setInputText(transcribedText);
      // Auto-send after voice input
      setTimeout(() => {
        handleSendMessage();
      }, 500);
    }
  };

  const handleSpeechError = (error: any) => {
    console.error('Speech recognition error:', error);
    Alert.alert('Error', 'Failed to recognize speech. Please try again.');
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    await sendMessage(inputText, selectedLanguage);
    setInputText('');
  };

  const handleVoiceInput = async () => {
    try {
      if (isListening) {
        await Voice.stop();
      } else {
        await Voice.start(selectedLanguage);
      }
    } catch (error) {
      console.error('Voice input error:', error);
      Alert.alert('Error', 'Failed to start voice recognition. Please check microphone permissions.');
    }
  };

  const handleSpeakResponse = async (text: string) => {
    try {
      setIsSpeaking(true);
      const audioBlob = await generateVoiceOutput(text, selectedLanguage);
      
      // Convert blob to base64 and play
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = reader.result as string;
        const audioUri = `data:audio/wav;base64,${base64Audio.split(',')[1]}`;
        
        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        soundRef.current = sound;
        await sound.playAsync();
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsSpeaking(false);
          }
        });
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Voice output error:', error);
      setIsSpeaking(false);
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[
      styles.messageContainer,
      item.role === 'user' ? styles.userMessage : styles.assistantMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.role === 'user' 
          ? { backgroundColor: theme.colors.primary }
          : { backgroundColor: theme.colors.surfaceVariant }
      ]}>
        <Text style={[
          styles.messageText,
          item.role === 'user' 
            ? { color: theme.colors.onPrimary }
            : { color: theme.colors.onSurface }
        ]}>
          {item.content}
        </Text>
        
        {item.suggestions && item.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {item.suggestions.map((suggestion: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => setInputText(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {item.proactiveTips && item.proactiveTips.length > 0 && (
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Proactive Tips:</Text>
            {item.proactiveTips.map((tip: string, index: number) => (
              <Text key={index} style={styles.tipText}>• {tip}</Text>
            ))}
          </View>
        )}
        
        {item.emotionalSupport && (
          <View style={styles.emotionalSupport}>
            <Text style={styles.emotionalSupportText}>💙 Emotional support provided</Text>
          </View>
        )}
      </View>
      
      {item.role === 'assistant' && (
        <TouchableOpacity
          style={styles.speakButton}
          onPress={() => handleSpeakResponse(item.content)}
          disabled={isSpeaking}
        >
          {isSpeaking ? (
            <VolumeX size={16} color={theme.colors.onSurfaceVariant} />
          ) : (
            <Volume2 size={16} color={theme.colors.primary} />
          )}
        </TouchableOpacity>
      )}
      
      <Text style={styles.messageTime}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Brain size={64} color={theme.colors.onSurfaceVariant} />
      <Text style={styles.emptyStateTitle}>Welcome to AI Counselor</Text>
      <Text style={styles.emptyStateSubtitle}>
        Ask me anything about college admissions, documents, or safety concerns
      </Text>
      
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => setInputText('What documents do I need for NEET counseling?')}
        >
          <Text style={styles.quickActionText}>Document Help</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => setInputText('Which colleges are safe for female students?')}
        >
          <Text style={styles.quickActionText}>Safety Check</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Brain size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>AI Counselor</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowLanguageSelector(!showLanguageSelector)}
          >
            <Languages size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton}>
            <Settings size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Selector */}
      {showLanguageSelector && (
        <View style={styles.languageSelector}>
          <Text style={styles.languageTitle}>Select Language</Text>
          <View style={styles.languageGrid}>
            {supportedLanguages.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  selectedLanguage === lang.code && styles.languageOptionSelected
                ]}
                onPress={() => {
                  setSelectedLanguage(lang.code);
                  setShowLanguageSelector(false);
                }}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[
                  styles.languageName,
                  selectedLanguage === lang.code && styles.languageNameSelected
                ]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={messages.length === 0 ? styles.emptyContainer : styles.messagesContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isLoading && (
        <View style={styles.typingIndicator}>
          <View style={styles.typingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
          <Text style={styles.typingText}>AI is thinking...</Text>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask your AI counselor anything..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            multiline
            maxLength={1000}
            editable={!isLoading}
          />
          
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isListening && styles.voiceButtonActive
            ]}
            onPress={handleVoiceInput}
            disabled={isLoading}
          >
            {isListening ? (
              <MicOff size={20} color={theme.colors.error} />
            ) : (
              <Mic size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={20} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        </View>
        
        {/* Voice Status */}
        <View style={styles.voiceStatus}>
          <Text style={styles.voiceStatusText}>
            {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Voice input available'}
          </Text>
          <Text style={styles.languageStatus}>
            Language: {supportedLanguages.find(l => l.code === selectedLanguage)?.name}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
    fontFamily: 'Inter-Bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageSelector: {
    padding: spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  languageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  languageOption: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    minWidth: 80,
  },
  languageOptionSelected: {
    backgroundColor: theme.colors.primaryContainer,
  },
  languageFlag: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  languageName: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Medium',
  },
  languageNameSelected: {
    color: theme.colors.onPrimaryContainer,
  },
  messagesList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    padding: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontFamily: 'Inter-Bold',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontFamily: 'Inter-Regular',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickActionButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: theme.colors.primaryContainer,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onPrimaryContainer,
    fontFamily: 'Inter-SemiBold',
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  suggestionsContainer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  suggestionChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  suggestionText: {
    fontSize: 12,
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Medium',
  },
  tipsContainer: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: borderRadius.md,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  tipText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  emotionalSupport: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  emotionalSupportText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  speakButton: {
    marginTop: spacing.xs,
    padding: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: theme.colors.surfaceVariant,
  },
  messageTime: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: spacing.xs,
    fontFamily: 'Inter-Regular',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  typingDots: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.onSurfaceVariant,
  },
  dot1: {
    animationDelay: '0ms',
  },
  dot2: {
    animationDelay: '150ms',
  },
  dot3: {
    animationDelay: '300ms',
  },
  typingText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    fontSize: 16,
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Regular',
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: theme.colors.errorContainer,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.onSurfaceVariant,
  },
  voiceStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  voiceStatusText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  languageStatus: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
});

export default AICounselorScreen; 