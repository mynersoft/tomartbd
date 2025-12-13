'use client';
import { useSession } from "next-auth/react";
import UserProfile from './UserProfile'

export default function ProfilePage() {
	const { data: session } = useSession();

	return (
        <UserProfile
			user={{
				name: session?.user?.name,
				phone: "01868944080",
				image: session?.user?.image,
			}}
		/>
	);
}
