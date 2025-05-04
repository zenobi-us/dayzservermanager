import { useLoginApi } from './features/auth/useLoginApi';
import { NavUser } from './nav-user';

export function UserContainer() {
  const loginApi = useLoginApi();

  if (!loginApi.username) {
    return (
      <NavUser
        onLoginSubmit={(data) => {
          console.log('login', data);
          loginApi.loginMutation.mutate({ data });
        }}
      />
    );
  }

  return (
    <NavUser
      user={{
        avatar:
          'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/39.jpg',
        name: loginApi.username,
        email: '',
      }}
    />
  );
}
