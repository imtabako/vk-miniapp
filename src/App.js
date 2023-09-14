import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Result from './panels/Result';
import List from './panels/List';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	const access_token = window.access_token;
	// console.log('<<<THIS>>>');
	// console.log(access_token);

	useEffect(() => {
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	// Helper function
	function getUrl(method, params) {
		params = params || {};
		params['access_token'] = access_token;
		params['v'] = '5.131';
		console.log('https://api.vk.com/method/' + method + '?' + $.param(params));
		return 'https://api.vk.com/method/' + method + '?' + $.param(params);
	}

	// Вызывает API метод с параметрами, при удачном исполнении вызывает функцию `callback'
	function sendRequest(method, params, callback) {
		$.ajax({
			url: getUrl(method, params),
			method: 'GET',
			dataType: 'JSONP',
			success: callback
		});
	}

	// Sex
	const [sex, setSex] = useState('female');
	const [sexFilter, setSexFilter] = useState(false);

	const onChangeSex = e => {
		setSex(e.target.value);
	};

	const onChangeSexFilter = e => {
		setSexFilter(e.target.checked);
	};

	// Age
	const [age, setAge] = useState(18);
	const [ageFilter, setAgeFilter] = useState(false);

	const onChangeAge = e => {
		const _minAge = 1;
		const _maxAge = 120;
		const age = Math.max(_minAge, Math.min(_maxAge, Number(e.target.value)));
		setAge(age);
	};

	const onChangeAgeFilter = e => {
		setAgeFilter(e.target.checked);
	};

	// Group
	const [groups, setGroups] = useState([]);

	const onChangeGroup = e => {
		// `e' is {value, label} Optional[]
		console.log(e);
		if (groups.length < e.length) {
			const group = e[e.length - 1];

			// Search for a vk group and if successfully found, push it to `groups'
			sendRequest('groups.search', {q: group.value}, function (data) {
				/* `data' is expected to be 
					{
					response: {
						count: COUNT, 
						items: [ {
							id, is_admin, is_member, name, photo_100, type
						},.. ] 
					} 
				} */
				console.log('-------');
				console.log(data);
				const response = data.response;
				if (response.count == 0) {
					return;
				}
				console.log(response);

				const g = response.items[0];
				const groupChip = {value: group.value, label: g.name, src: g.photo_100, gid: g.id};	// `gid' is vk group id
				console.log(groupChip);
				console.log(groups);
				// groups.push(groupChip);
				setGroups([].concat(groups, groupChip));
			});
		} else {
			setGroups(e);
		}
	};

	// TODO: При вводе названия, предлагать сообщества в выпадающем списке
	const onInputChangeGroup = e => {
		// console.log('>>> ');
		// console.log(groups);
		// console.log(e)
	};

	/* Submit form and get (un)counted users from selected poll
	   Needs:
	   1) poll
	   2) filter options (deleted, sex, age, bot check, subscriptions, cities) */
	function getPollUsers() {

	}
	

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout popout={popout}>
						<SplitCol>
							<View activePanel={activePanel}>
								{/* TODO: Чекбоксы 
								  "Не засчитывать голоса", 
								  "Не засчитывать страницы бото", 
								  "Проверять на всту", 
								  "Засчитывать только пользователей из города(ов):" 

								  формат [option, setOption] = useState();
								  Передать их панели Home*/}
								<Home 
									id='home' fetchedUser={fetchedUser} go={go} 
									sex={sex} sexFilter={sexFilter} onChangeSex={onChangeSex} onChangeSexFilter={onChangeSexFilter}	// sex
									age={age} ageFilter={ageFilter} onChangeAge={onChangeAge} onChangeAgeFilter={onChangeAgeFilter}	// age
									groups={groups} onChangeGroup={onChangeGroup} onInputChangeGroup={onInputChangeGroup}			// groups
								/>
								<Result id='result' go={go} />
								<List id='list' go={go} />
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
