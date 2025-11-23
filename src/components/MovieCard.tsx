import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TMDB_IMAGE_BASE_URL } from '../constants/api';
import { ColorScheme, COLORS } from '../constants/colors';
import { toggleFavorite, saveFavorites } from '../redux/favoritesSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  colors?: ColorScheme; 
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress, colors: propColors }) => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const favorites = useAppSelector((state) => state.favorites.items);
  const colors = propColors ?? COLORS[themeMode];

  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(movie));
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];
    dispatch(saveFavorites(updatedFavorites));
  };

  const imageUri = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: imageUri }} style={styles.image} />

      <TouchableOpacity
        style={[
          styles.favoriteButton,
          { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 0.5 },
        ]}
        onPress={handleToggleFavorite}
      >
        <Feather
          name="heart"
          size={20}
          color={isFavorite ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {movie.title}
        </Text>

        <View style={styles.meta}>
          <View style={styles.rating}>
            <Feather name="star" size={14} color="#FFC107" />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {movie.vote_average?.toFixed(1) || 'N/A'}
            </Text>
          </View>

          <Text style={[styles.year, { color: colors.textSecondary }]}>
            {movie.release_date?.split('-')[0] || 'TBA'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 225,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  year: {
    fontSize: 12,
  },
});

export default MovieCard;