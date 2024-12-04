import Logo from '../Logo/Index'
import OpcoesHeader from '../OpcoesHeader/Index'
import styled from 'styled-components'

const HeaderContainer = styled.header`
    background-color: #FFF;
    display: flex;
    justify-content: center;
`

function Header() {
    return (
        <HeaderContainer>
            <Logo/>
            <OpcoesHeader/>
        </HeaderContainer>
    )
}

export default Header