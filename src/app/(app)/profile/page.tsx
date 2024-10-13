// "use client"
// import React from 'react';
// import { User, Mail, GraduationCap } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Skeleton } from '@/components/ui/skeleton';

// const UserProfilePage = ({ user, isLoading, error }) => {
//   if (isLoading) {
//     return <LoadingProfile />;
//   }

//   if (error) {
//     return <ErrorProfile error={error} />;
//   }

//   if (!user) {
//     return <ErrorProfile error="User data not available" />;
//   }

//   const { fullName, email, role } = user;

//   return (
//     <div className="container mx-auto p-4">
//       <Card className="w-full max-w-md mx-auto">
//         <CardHeader className="flex flex-col items-center">
//           {/* <Avatar className="w-24 h-24">
//             <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${fullName}`} alt={fullName} />
//             <AvatarFallback>{fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
//           </Avatar> */}
//           <CardTitle className="mt-4 text-2xl font-bold">{fullName}</CardTitle>
//           <Badge variant="secondary" className="mt-2">
//             {role === 'student' ? (
//               <GraduationCap className="w-4 h-4 mr-1" />
//             ) : (
//               <ChalkboardTeacher className="w-4 h-4 mr-1" />
//             )}
//             {role.charAt(0).toUpperCase() + role.slice(1)}
//           </Badge>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex items-center space-x-2">
//               <User className="w-5 h-5 text-gray-500" />
//               <span>{fullName}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Mail className="w-5 h-5 text-gray-500" />
//               <span>{email}</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// const LoadingProfile = () => (
//   <div className="container mx-auto p-4">
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader className="flex flex-col items-center">
//         <Skeleton className="w-24 h-24 rounded-full" />
//         <Skeleton className="h-8 w-[200px] mt-4" />
//         <Skeleton className="h-4 w-[100px] mt-2" />
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <Skeleton className="h-4 w-full" />
//           <Skeleton className="h-4 w-full" />
//         </div>
//       </CardContent>
//     </Card>
//   </div>
// );

// const ErrorProfile = ({ error }) => (
//   <div className="container mx-auto p-4">
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle className="text-red-500">Error</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <p>{error}</p>
//       </CardContent>
//     </Card>
//   </div>
// );

// export default UserProfilePage;