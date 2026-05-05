import React, { useRef, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Voice from '@react-native-voice/voice';

type Props = TextInputProps & {
  appendResults?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

let activeVoiceSession: symbol | null = null;

async function requestMicrophonePermission() {
  if (Platform.OS !== 'android') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: 'Microphone permission',
      message: 'Voice input needs access to your microphone.',
      buttonPositive: 'Allow',
      buttonNegative: 'Cancel',
    }
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export default function VoiceTextInput({
  value,
  onChangeText,
  appendResults = false,
  containerStyle,
  style,
  multiline,
  ...props
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const [isListening, setIsListening] = useState(false);

  const stopListening = async () => {
    try {
      await Voice.stop();
      await Voice.destroy();
    } catch {}
    activeVoiceSession = null;
    setIsListening(false);
  };

  const startListening = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      Alert.alert('Microphone permission needed', 'Allow microphone access to use voice input.');
      return;
    }

    const session = Symbol('voice-session');
    activeVoiceSession = session;

    Voice.onSpeechResults = (event: any) => {
      if (activeVoiceSession !== session) return;
      const spokenText = event?.value?.[0]?.trim();
      if (spokenText && onChangeText) {
        const currentValue = typeof value === 'string' ? value.trim() : '';
        const nextValue =
          appendResults && currentValue
            ? `${currentValue} ${spokenText}`.trim()
            : spokenText;
        onChangeText(nextValue);
      }
    };

    Voice.onSpeechEnd = () => {
      if (activeVoiceSession !== session) return;
      activeVoiceSession = null;
      setIsListening(false);
    };

    Voice.onSpeechError = () => {
      if (activeVoiceSession !== session) return;
      activeVoiceSession = null;
      setIsListening(false);
    };

    try {
      inputRef.current?.focus();
      setIsListening(true);
      await Voice.start('en-US');
    } catch {
      activeVoiceSession = null;
      setIsListening(false);
      Alert.alert('Voice input unavailable', 'Speech recognition could not start on this device.');
    }
  };

  return (
    <View style={[styles.container, multiline && styles.multilineContainer, containerStyle]}>
      <TouchableOpacity
        style={[styles.micButton, multiline && styles.micButtonTop, isListening && styles.micButtonActive]}
        onPress={() => {
          if (isListening) {
            void stopListening();
            return;
          }
          void startListening();
        }}
        activeOpacity={0.8}
      >
        <Ionicons name={isListening ? 'mic' : 'mic-outline'} size={18} color={isListening ? '#FFFFFF' : '#FF7A33'} />
      </TouchableOpacity>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, multiline && styles.multilineInput, style]}
        multiline={multiline}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  multilineContainer: {
    justifyContent: 'flex-start',
  },
  micButton: {
    position: 'absolute',
    left: 12,
    zIndex: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0E6',
  },
  micButtonTop: {
    top: 12,
  },
  micButtonActive: {
    backgroundColor: '#FF7A33',
  },
  input: {
    paddingLeft: 48,
  },
  multilineInput: {
    paddingTop: 12,
  },
});
