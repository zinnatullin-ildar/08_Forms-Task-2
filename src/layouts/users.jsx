import { useParams } from "react-router-dom";
import UsersListPage from "../components/page/usersListPage";
import UserPage from "../components/page/userPage";
import Edit from "../components/ui/edit";

const Users = () => {
    const params = useParams();
    const { userId, edit } = params;

    return (
        <>
            {userId ? (
                edit ? (
                    <Edit />
                ) : (
                    <UserPage userId={userId} />
                )
            ) : (
                <UsersListPage />
            )}
        </>
    );
    // если выбран юзер по id, то если есть параметр edit, то рендерим форму редактирования юзера, если нет, то карточку юзера
    // если юзер по id не выбран, рендерим список юзеров
};

export default Users;
