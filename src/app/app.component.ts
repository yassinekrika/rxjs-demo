import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, Subject, combineLatest, map, of, switchMap, throwError, catchError, interval, takeUntil, take, mergeMap } from 'rxjs';
import { TestScheduler  } from 'rxjs/testing';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  styleUrl: './app.component.css',
  template: `
    <p>{{data}}</p>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  data: string | undefined 

  constructor(
    private http: HttpClient
  ) {

  }
  
  ngOnInit() {
    // this.simpleObservable()  
    // this.operators()
    // this.getRandomUser()
    // this.subject()
    // this.streams()
    // this.errorHandling()
    // this.avoidMemoryLeaks()
    // this.advancedOperators()
    this.testingRxJS()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  simpleObservable() {
    const myObservable = new Observable<string>((observer) => {
      observer.next('My new App')
      observer.complete()
    })

    myObservable.subscribe({
      next: (value) => (this.data = value),
      complete: () => console.log('Observable completed')
    })
  }

  operators() {
    const myObservable = of(1, 2, 3, 4).pipe(
      map(value => value * 2)
    )

    myObservable.subscribe(
      (val) => {
        console.log(val)
      }
    )
  }

  results: any
  getRandomUser() {
    this.http.get('https://randomuser.me/api/')
    .pipe(
      switchMap((user: any) => this.http.get('https://randomuser.me/api/'))
    )
    .subscribe(user => {
      this.results = JSON.stringify(user)
      console.log(this.results)
    })
  }

  subject() {
    const subject = new Subject<number>()

    subject.subscribe(val => console.log('Subscriber 1', val))
    subject.subscribe(val => console.log('Subscriber 1', val))

    subject.next(1) 
    subject.next(2)
  }

  streams() {
    const obs1 = of('angular') 
    const obs2 = of('rxjs')
    
    combineLatest([obs1, obs2]).subscribe(([val1, val2]) => {
      console.log(`${val1} ${val2}`)
    })
  }

  errorHandling() {
    const errorPhoneObservable = throwError('An error occured') 
    errorPhoneObservable
      .pipe(
        catchError(error => {
          console.error('Caught error', error);
          return of('Fallback value')
        })
      ).subscribe(value => console.log(value))
  }

  counter = 0;
  private destroy$ = new Subject<void>()
  avoidMemoryLeaks() {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => (this.counter = val))
  }

  advancedOperators() {
    const letters = of('a', 'b', 'c')
    const numbers = interval(1000).pipe(take(3))
    
    letters.pipe(
      mergeMap(letter => numbers, (letter, number) => `${letter}${number}`)
    ).subscribe(x => console.log(x))
  }

  testingRxJS() {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected)
    })

    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a-b-c|');
      const expectMarble = 'x-y-z|';

      const resutls$ = source$.pipe(map(val => val.toUpperCase()))

      expectObservable(resutls$).toBe(expectMarble, {
        x: 'X',
        y: 'Y',
        z: 'Z'
      })
    })
  }
}
