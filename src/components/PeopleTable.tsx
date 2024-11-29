import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { Person } from "../interfaces/person";
import "./peopleTable.scss";
import Loader from "./small/loader";
import EditPencil from "./small/editPencil";
import TrashCan from "./small/trashCan";
import AddPlus from "./small/addPlus";
import SaveFloppy from "./small/saveFloppy";

const NEW_PERSON = {
    birth_year: "",
    eye_color: "",
    gender: "",
    hair_color: "",
    height: "",
    homeworld: "",
    mass: "",
    name: "",
    skin_color: "",
    url: "",
};

interface PeopleTableProps {
    searchQuery: string;
}

const PeopleTable: React.FC<PeopleTableProps> = ({ searchQuery }) => {
    const [people, setPeople] = useState<Person[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchPeople = async () => {
            setIsLoading(true);
            try {
                let allPeople: Person[] = [];
                let nextUrl = `https://swapi.dev/api/people/`;

                if (checkQuery(searchQuery)) {
                    nextUrl += `?search=${searchQuery}`;
                }

                while (nextUrl) {
                    const response = await axios.get(nextUrl);
                    allPeople = [...allPeople, ...response.data.results];
                    nextUrl = response.data.next;
                }
                setPeople(allPeople);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error("Error fetching people:", error);
            }
        };

        fetchPeople();
    }, []);

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>,
        person: Person,
        field: keyof Person
    ) => {
        const updatedPerson = { ...person, [field]: event.target.value };
        setPeople(
            people.map((p) => (p.url === person.url ? updatedPerson : p))
        );
    };

    const handleAddNewPerson = () => {
        const personWithUrl = { ...NEW_PERSON, url: "new" };
        setPeople([...people, personWithUrl]);
        setIsEditing({ ...isEditing, [personWithUrl.url]: true });
    };

    const handleEditToggle = (person: Person) => {
        console.log(">>> person.url ", person.url);
        setIsEditing({ ...isEditing, [person.url]: !isEditing[person.url] });
    };

    const handleSaveToggle = (person: Person) => {
        if (person.url == "new") {
            const randomNum = Math.floor(Math.random() * (9999 - 1 + 1)) + 1;
            const personWithUrl = {
                ...person,
                url: `new_${person.name}${randomNum}`,
            };
            setPeople([
                ...people.filter((p) => p.url !== person.url),
                personWithUrl,
            ]);
        }
        handleEditToggle(person);
    };

    const handleDelete = (person: Person) => {
        setPeople(people.filter((p) => p.url !== person.url));
    };

    const isSaveDisabled = (person: Person) => {
        if (person.name.length < 1) {
            return true;
        }
        return false;
    };

    const isCreateDisabled = () => {
        return people.some((person) => person.url === "new");
    };

    const checkQuery = (input: string) => {
        const regex = /^[a-zA-Z0-9\s]*$/;
        return regex.test(input);
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="people-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Height</th>
                                <th>Mass</th>
                                <th>Gender</th>
                                <th>Birth Year</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {people.map((person) => (
                                <tr key={person.url}>
                                    {isEditing[person.url] ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={person.name}
                                                    placeholder="name"
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            person,
                                                            "name"
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={person.height}
                                                    placeholder="height"
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            person,
                                                            "height"
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={person.mass}
                                                    placeholder="mass"
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            person,
                                                            "mass"
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={person.gender}
                                                    placeholder="gender"
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            person,
                                                            "gender"
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={person.birth_year}
                                                    placeholder="birth_year"
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            person,
                                                            "birth_year"
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    disabled={isSaveDisabled(
                                                        person
                                                    )}
                                                    onClick={() =>
                                                        handleSaveToggle(person)
                                                    }
                                                >
                                                    <SaveFloppy />
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{person.name}</td>
                                            <td>{person.height}</td>
                                            <td>{person.mass}</td>
                                            <td>{person.gender}</td>
                                            <td>{person.birth_year}</td>
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        handleEditToggle(person)
                                                    }
                                                >
                                                    <EditPencil />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(person)
                                                    }
                                                >
                                                    <TrashCan />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="create-button-box">
                        <button
                            onClick={handleAddNewPerson}
                            disabled={isCreateDisabled()}
                        >
                            <AddPlus />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default PeopleTable;
