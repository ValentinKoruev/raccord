import { useQuery } from '@tanstack/react-query';
import apiQueries from '@queries/api';

const Profile = () => {
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await apiQueries.userQueries.getUser();
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (!isSuccess) return <div>Error loading profile</div>;

  console.log(data);
  return (
    <div>
      <h2>{data.name}</h2>
      <p>ID: {data.publicId}</p>
      <img src={data.icon} alt="Profile" width={100} height={100} />
    </div>
  );
};
export default Profile;
