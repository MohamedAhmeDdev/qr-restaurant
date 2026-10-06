import { ProtectedRoute } from "../../../utils/ProtectedRoute";
import Restaurants from '../../restaurant/restaurant/Restaurants';
import CreateRestaurant from '../../restaurant/restaurant/CreateRestaurant';
import EditRestaurant from '../../restaurant/restaurant/EditRestaurant';
import Organization from "../../restaurant/Settings/Layout/Organization";

// routes/RestaurantSelectorRoutes.jsx
export const RestaurantSelectorRoutes = {
  path: '/restaurant',
  element: <ProtectedRoute allowedRoles={['restaurant_admin']} />,
  children: [
    { index: true, element: <Restaurants /> },
    { path: 'create', element: <CreateRestaurant /> },
    { path: 'edit/:id', element: <EditRestaurant /> },
    { path: 'organization/settings', element: <Organization /> },
  ],
};