import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Result from './panels/Result';
import Spisok from './panels/Spisok';

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

	// Sex
	const [sex, setSex] = useState('Женщин');
	const [sexFilter, setSexFilter] = useState(false);

	const onChageSex = e => {
		console.log(e.target.value);
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
								  Передать их панели Home*/}
								<Home 
									id='home' fetchedUser={fetchedUser} go={go} 
									sex={sex} sexFilter={sexFilter} onChageSex={onChageSex} onChangeSexFilter={onChangeSexFilter}	// sex
									age={age} ageFilter={ageFilter} onChangeAge={onChangeAge} onChangeAgeFilter={onChangeAgeFilter}	// age
								/>
								<Result id='result' go={go} />
								<Spisok id='spisok' go={go} />
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
