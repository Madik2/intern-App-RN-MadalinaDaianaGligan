import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import currentEnvironment from '@/constants/environment';
import { useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox';
import { useThemeColor } from '@/hooks/useThemeColor';

type Gender = 'female' | 'male' | '';

type User = {
  gender: Gender;
  login: {
    uuid: string;
  };
  name: {
    first: string;
    last: string;
  };
};

export default function TabTwoScreen() {
  const headerBackgroundColor = useThemeColor({}, 'tint');

  const [users, setUsers] = useState<User[]>([]);
  const [gender, setGender] = useState<Gender>('');
  const [pageToGet, setPageToGet] = useState<number>(1);

  const getUsers = async (page: number) => {
    const result = await fetch(
      `${currentEnvironment.api.baseUrl}?results=5&gender=female&page=${String(page)}`,
    );
    const responseJson = await result.json();

    const usersResults = responseJson.results as User[];
    console.log('pageNumber', page);
    setUsers(oldUsers =>
      page === 1 ? usersResults : [...oldUsers, ...usersResults],
    );
  };

  useEffect(() => {
    void (async () => {
      await getUsers(pageToGet);
    })();
  }, [pageToGet]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: headerBackgroundColor,
        dark: headerBackgroundColor,
      }}
      headerImage={
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.webp')}
            style={styles.logo}
          />
        </View>
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Users</ThemedText>
      </ThemedView>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Checkbox
          value={gender === 'female'}
          onValueChange={() => {
            setGender('female');
          }}
          color={gender === 'female' ? '#4630EB' : undefined}
        />
        <ThemedText>Female</ThemedText>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Checkbox
          value={gender === 'male'}
          onValueChange={() => {
            setGender('male');
          }}
          color={gender === 'male' ? '#4630EB' : undefined}
        />
        <ThemedText>Male</ThemedText>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Checkbox
          value={gender === ''}
          onValueChange={() => {
            setGender('');
          }}
          color={gender === '' ? '#4630EB' : undefined}
        />
        <ThemedText>All</ThemedText>
      </View>
      {users.length > 0
        ? users.map((user: User) => (
            <Text key={user.login.uuid} style={{ color: 'black' }}>
              {user.name.first} {user.name.last} {user.gender}
            </Text>
          ))
        : null}
      <TouchableOpacity
        style={styles.loadMore}
        onPress={() => {
          setPageToGet(oldPageValue => oldPageValue + 1);
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Load More</Text>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    width: '100%',
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadMore: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 6,
  },
});

// 1. The logo spills out of its designated area.
// 2. TEC theme is not displayed on the header bar instead a green color is seen.
// 3. Users screen does not display any data.
// 4. Load more button style is not working.
// 5. Style issues are encountered on the page - style however you want.
// 6. Additional data is not displayed upon using "Load more" button.
// 7. Users are not filtered by gender and the list does not reset on change checkbox.
// 8. No loading state is displayed when accessing "Users" component.
// 9. On home page user should be able to do the following actions with cards that contain 2 fields: Title and Description
//     - See all the cards already added
//     - Add a card
//     - Update a card
//     - Delete a card
// 10.Use the phone camera to take a picture and show it to the home screen.
