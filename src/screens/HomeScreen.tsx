import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { fetchTrendingMovies, fetchPopularMovies } from '../redux/movieSlice';
import { loadFavorites } from '../redux/favoritesSlice';
import MovieCard from '../components/MovieCard';
import Header from '../components/Header';
import { COLORS } from '../constants/colors';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { MainTabParamList, Movie } from '../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { trending, popular, loading } = useAppSelector((state) => state.movies);
  const themeMode = useAppSelector((state) => state.theme.mode);
  const colors = COLORS[themeMode];

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMovies();
    dispatch(loadFavorites());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMovies = () => {
    dispatch(fetchTrendingMovies(1));
    dispatch(fetchPopularMovies(1));
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMovies();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const navigateToDetails = (movie: Movie) => {
    (navigation.getParent() as any)?.navigate('Details', { movieId: movie.id });
  };

  const renderMovieItem: ListRenderItem<Movie> = ({ item }) => (
    <MovieCard movie={item} onPress={() => navigateToDetails(item)} colors={colors} />
  );

  if (loading && !refreshing && trending.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="StreamBox" showLogout={true} colors={colors} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading movies...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="StreamBox" showLogout={true} colors={colors} />

      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View>
            {/* Trending Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Trending This Week
              </Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={trending}
                renderItem={renderMovieItem}
                keyExtractor={(item) => `trending-${item.id}`}
                contentContainerStyle={styles.listContent}
              />
            </View>

            {/* Popular Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Popular Movies
              </Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={popular}
                renderItem={renderMovieItem}
                keyExtractor={(item) => `popular-${item.id}`}
                contentContainerStyle={styles.listContent}
              />
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]} // Android spinner color
            progressBackgroundColor={colors.card}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 15,
  },
  listContent: {
    paddingLeft: 15,
    paddingRight: 5,
  },
});

export default HomeScreen;