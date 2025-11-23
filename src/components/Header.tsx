import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorScheme, COLORS } from '../constants/colors';
import { toggleTheme, saveTheme } from '../redux/themeSlice';
import { logoutUser } from '../redux/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

interface HeaderProps {
  title: string;
  showLogout?: boolean;
  colors?: ColorScheme; 
}

const Header: React.FC<HeaderProps> = ({ title, showLogout = false, colors: propColors }) => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const user = useAppSelector((state) => state.auth.user);
  const colors = propColors ?? COLORS[themeMode];

  const handleToggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    dispatch(toggleTheme());
    dispatch(saveTheme(newTheme));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Feather name="film" size={24} color={colors.primary} />
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {user && (
              <Text style={[styles.username, { color: colors.textSecondary }]}>
                Welcome, {user.firstName || user.username}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={handleToggleTheme}>
            <Feather
              name={themeMode === 'light' ? 'moon' : 'sun'}
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          {showLogout && (
            <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
              <Feather name="log-out" size={22} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 12,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 10,
  },
});

export default Header;