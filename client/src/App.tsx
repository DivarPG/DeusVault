import {Routes, Route} from 'react-router-dom';
import StartPage from './pages/startPage';
import SignInPage from './pages/signInPage';
import RegisterPage from './pages/registerPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import EditTemplatePage
    from './pages/EditTemplatePage';


function App() {
    return (
        <Routes>
            <Route path="/" element={<StartPage/>}/>
            <Route path="/signIn" element={<SignInPage/>}/>
            <Route path="/registration" element={<RegisterPage/>}/>
            <Route
                path="/collections"
                element={
                    <ProtectedRoute>
                        <CollectionsPage/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/collections/:id"
                element={
                    <ProtectedRoute>
                        <CollectionDetailPage/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/collections/:id/template"
                element={<EditTemplatePage/>}
            />
        </Routes>
    );
}

export default App;