import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
  ViewStyle,
  KeyboardAvoidingViewProps,
} from 'react-native';

interface KeyboardAwareContainerProps extends KeyboardAvoidingViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const KeyboardAware: React.FC<KeyboardAwareContainerProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      {...props}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default KeyboardAware;
