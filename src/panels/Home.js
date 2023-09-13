import React from 'react';
import PropTypes, { elementType } from 'prop-types';
import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Checkbox, FormLayout, FormItem, Input, 
	SimpleCell, FormLayoutGroup, ChipsInput, Select, Text, AdaptivityProvider, Slider, View} from '@vkontakte/vkui';

const Home = ({Home, go, 
	age, onChangeAge, ageFilter, onChangeAgeFilter,
	sex, onChageSex, sexFilter, onChangeSexFilter}) => (
	<Panel id={Home}>
		<PanelHeader>Проверка опросов</PanelHeader>
		<Group>
			<Header>
				<Div>
					<Text weight="1">Важно!</Text>
					<Text>Вы должны состоять сами в сообществе, голосование которого вы проверяете!</Text>	
				</Div>
			</Header>
		</Group>
		<Group>
			<FormLayout>
				<Header>
				<FormLayoutGroup mode="horizontal">
					<FormItem>
						<Input 
							id="quiz-input" 
							type="url"
							placeholder="https://vk.com/wall-142120544_3"
						/>
					</FormItem>
					<FormItem>
						<Button size='l' onClick={go} data-to="result">Проверить</Button>
					</FormItem>
				</FormLayoutGroup>
				</Header>
				<Header>
				<FormLayoutGroup mode="horizontal">
					<Checkbox>Не засчитывать голоса удаленных пользователей.</Checkbox>
				</FormLayoutGroup>
				</Header>
				<Header>
				<FormLayoutGroup mode="horizontal">
					<Checkbox id='sexCheck' onChange={onChangeSexFilter}>Засчитывать только:</Checkbox>
					<FormItem>
						<Select
							placeholder='Женщин'
							disabled={!sexFilter}
							value={sex}
							onChange={onChageSex}
							options={[
								{label: 'Женщин', value: 'female'},
								{label: 'Мужчин', value: 'male'},
							]}
						/>
					</FormItem>
				</FormLayoutGroup>
				</Header>
				<Header>
				<FormLayoutGroup mode="horizontal" >
				<Checkbox id='ageCheck' onChange={onChangeAgeFilter}>Засчитывать пользователей возрастом старше:</Checkbox>
					<FormItem>
						<Input 
							id='age'
							value={age}
							type='number'
							disabled={!ageFilter}
							placeholder="18" after="лет"
							onChange={onChangeAge}
						/>
					</FormItem>
				</FormLayoutGroup>
				</Header>
				<Header>
				<FormLayoutGroup mode="horizontal">
					<Checkbox>Не засчитывать страницы ботов и левые страницы.</Checkbox>
				</FormLayoutGroup>
				</Header>
				<Header>
				<FormLayoutGroup mode="horizontal">
					<Checkbox>Проверять на вступление в группу:</Checkbox>
					<FormItem>
						<ChipsInput></ChipsInput>
					</FormItem>
				</FormLayoutGroup>
				</Header>
				<Header>
				<FormLayoutGroup mode="horizontal">
					<Checkbox>Засчитывать только пользователей из города(ов):</Checkbox>
					<FormItem>
						<ChipsInput></ChipsInput>
					</FormItem>
				</FormLayoutGroup>
				</Header>
			</FormLayout>
		</Group>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	// sex
	sex: PropTypes.number.isRequired,
	onChageSex: PropTypes.func.isRequired,
	sexFilter: PropTypes.bool.isRequired,
	onChangeSexFilter: PropTypes.func.isRequired,
	// age
	age: PropTypes.number.isRequired,
	onChangeAge: PropTypes.func.isRequired,
	ageFilter: PropTypes.bool.isRequired,
	onChangeAgeFilter: PropTypes.func.isRequired,
	// groups
	groups: PropTypes.array.isRequired,
	onChangeGroup: PropTypes.func.isRequired,
};

export default Home;
