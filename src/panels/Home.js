import React from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Checkbox, FormLayout, FormItem, Input, FormLayoutGroup, ChipsInput, Select, Text } from '@vkontakte/vkui';

const Home = ({ id, go, fetchedUser }) => (
	// <Panel id={id}>
	// 	<PanelHeader>Example</PanelHeader>
	// 	{fetchedUser &&
	// 	<Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>
	// 		<Cell
	// 			before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
	// 			subtitle={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
	// 		>
	// 			{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
	// 		</Cell>
	// 	</Group>}

	// 	<Group header={<Header mode="secondary">Navigation Example</Header>}>
	// 		<Div>
	// 			<Button stretched size="l" mode="secondary" onClick={go} data-to="persik">
	// 				Show me the Persik, please
	// 			</Button>
	// 		</Div>
	// 	</Group>
	// </Panel>
	<Panel id={id}>
		<PanelHeader>Проверка опроса</PanelHeader>
		<Group>
			<FormLayout>
				<FormLayoutGroup mode="horizontal">
					<FormItem>
						<Input 
							id="quiz-input" 
							type="url" 
							placeholder="https://vk.com/wall-142120544_3"
						/>
					</FormItem>
					<FormItem>
						<Button>Проверить</Button>
					</FormItem>
				</FormLayoutGroup>
				<FormLayoutGroup mode="vertical">
					<Checkbox>Не засчитывать голоса удаленных пользователей</Checkbox>
				</FormLayoutGroup>
				<FormLayoutGroup mode="horizontal">
					<Checkbox>Засчитывать только</Checkbox>
					<FormItem>
						<Select
							placeholder='Женщин'
							options={[
								{label: 'Женщин', value: 'female'},
								{label: 'Мужчин', value: 'male'},
							]}
						/>
					</FormItem>
				</FormLayoutGroup>
				<FormLayoutGroup mode="horizontal">
					<Checkbox>Засчитывать пользователей старше</Checkbox>
					<Input 
						placeholder="18"
					/>
					<Text> лет</Text>
				</FormLayoutGroup>
				<FormLayoutGroup mode="vertical">
					<Checkbox>Не засчитывать страницы ботов и левые страницы</Checkbox>
					<Checkbox>Проверять на вступление в группу:</Checkbox>
					<ChipsInput></ChipsInput>
					<Checkbox>Засчитывать только пользователей из города(ов):</Checkbox>
					<ChipsInput></ChipsInput>
				</FormLayoutGroup>
			</FormLayout>
		</Group>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
