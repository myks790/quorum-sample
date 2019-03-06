import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class SliderbarComponent extends Component {

    onClickMenu = (menu) => {
        this.props.changeMenu(this.props.menu.findIndex((item) => {
            return item.title === menu.target.innerText
        }));
    };

    contents = () => {
        return this.props.menu.map((item, index) => {
            return <li key={index} className={this.props.selectedMenu === index ? 'active' : ''}>
                <Link to={item.path} onClick={this.onClickMenu}  name={item.title}>{item.title}</Link>
            </li>
        });
    };

    render() {
        return (
            <aside className="main-sidebar">
                <section className="sidebar">
                    <ul className="sidebar-menu" style={{color: 'darkgray'}}>
                        <li className="header">MAIN NAVIGATION</li>
                        {this.contents()}
                    </ul>
                </section>
            </aside>
        )
    }

}

export default SliderbarComponent;