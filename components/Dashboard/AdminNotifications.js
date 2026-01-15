// import { useSelector, useDispatch } from "react-redux";
// import { useNotifications } from "@/hooks/useNotifications";
// import { markAsRead, markAllAsRead } from "@/store/slices/notificationSlice";

// export default function AdminNotifications() {
//   const dispatch = useDispatch();
//   const { notifications, unreadCount } = useSelector(state => state.notification);



//   return (
//     <div className="p-4 border rounded w-80">
//       <div className="flex justify-between items-center mb-2">
//         <h2 className="text-lg font-bold">Notifications ({unreadCount})</h2>
//         <button
//           className="text-sm text-blue-500"
//           onClick={() => dispatch(markAllAsRead())}
//         >
//           Mark all as read
//         </button>
//       </div>
//       <ul className="space-y-2">
//         {notifications.map((n) => (
//           <li
//             key={n._id}
//             className={`p-2 rounded border ${
//               n.isRead ? "bg-gray-100" : "bg-yellow-100 font-bold"
//             }`}
//             onClick={() => dispatch(markAsRead(n._id))}
//           >
//             <div>{n.title}</div>
//             <div className="text-sm text-gray-700">{n.message}</div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


const AdminNotifications = () => {
  return (
    <div>
      Enter
    </div>
  );
}

export default AdminNotifications;