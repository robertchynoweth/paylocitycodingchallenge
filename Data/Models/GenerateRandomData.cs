using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.CompilerServices;

namespace paylocity.Data.Models
{
    public class GenerateRandomData : IGenerateRandomData
    {
        private readonly Random _gen = new Random(DateTime.Now.Millisecond);
        private readonly DateTime _start = new DateTime(2015, 1, 1);
        private readonly List<FakeName> _fakeNames;
        private int _fakeNamesCountTotal;
        private int _fakeNamescurrent;

        public GenerateRandomData()
        {
            _fakeNames = LoadFakeNames();
        }

        public List<Employee> GenerateFakeData(int clientId)
        {
            _fakeNamesCountTotal = _fakeNames.Count;
            _fakeNamescurrent = _gen.Next(0, _fakeNamesCountTotal - 1);

            List<Employee> employees = new List<Employee>();

            for (int i = 0; i < 28; i++)
            {
                var fakeName = GetNextName();

                var employee = new Employee
                {
                    FirstName = fakeName.f,
                    LastName = fakeName.l,
                    BiWeeklyPay = _gen.Next(1500, 2500),
                    ClientId = clientId,
                    Dependents = GenerateDependents(),
                    DateHired = GenerateRandomDate()
                };

                employees.Add(employee);
            }

            return employees;
        }

        private List<Dependent> GenerateDependents()
        {
            var dependents = new List<Dependent>();

            var numOfDependents = _gen.Next(0, 5);
            var hasSpouse = _gen.Next(0, 100) > 10;

            for (int i = 0; i < numOfDependents; i++)
            {
                var fakeName = GetNextName();
                dependents.Add(new Dependent
                {
                    FirstName = fakeName.f,
                    LastName = fakeName.l,
                    IsSpouse = hasSpouse && i == 0
                });
            }

            return dependents;
        }

        private FakeName GetNextName()
        {
            if (_fakeNamescurrent == _fakeNamesCountTotal - 1)
            {
                _fakeNamescurrent = 0;
            }

            return _fakeNames[_fakeNamescurrent++];
        }

        private List<FakeName> LoadFakeNames()
        {
            List<FakeName> items;
            using (StreamReader r = new StreamReader("./Data/fakeData.json"))
            {
                string json = r.ReadToEnd();
                items = JsonConvert.DeserializeObject<List<FakeName>>(json);
            }
            return items;
        }

        private DateTime GenerateRandomDate()
        {
            int range = (DateTime.Today - _start).Days;
            return _start.AddDays(_gen.Next(range));
        }

        public class FakeName
        {
            public string f;
            public string l;
        }
    }
}
