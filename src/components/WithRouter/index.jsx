import { useNavigate, useParams  } from 'react-router-dom'
function withRouter(Component) {
    return function Wrapper(props) {
        const navigate = useNavigate();
        const params = useParams()
        return <Component {...props} navigate={navigate} params={params}/>;
    };
}

export default withRouter